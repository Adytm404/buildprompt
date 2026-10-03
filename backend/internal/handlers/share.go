package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"strings"

	"github.com/Adytm404/buildprompt/backend/internal/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func newShareToken() string {
	buf := make([]byte, 18)
	if _, err := rand.Read(buf); err != nil {
		return models.NewID("shr")
	}
	return hex.EncodeToString(buf)
}

// CreateShare creates (or reuses) a public token for a project.
func (h *Handler) CreateShare(c *fiber.Ctx) error {
	user, err := h.currentUser(c)
	if err != nil {
		return err
	}
	project, err := h.findProject(user.ID, c.Params("id"))
	if err != nil {
		return err
	}

	var share models.Share
	findErr := h.DB.Where("project_id = ?", project.ID).Order("created_at DESC").First(&share).Error
	if errors.Is(findErr, gorm.ErrRecordNotFound) {
		share = models.Share{
			ID:        models.NewID("shr"),
			ProjectID: project.ID,
			UserID:    user.ID,
			Token:     newShareToken(),
		}
		if err := h.DB.Create(&share).Error; err != nil {
			return fail(c, fiber.StatusInternalServerError, "Gagal membuat tautan berbagi.")
		}
	} else if findErr != nil {
		return fail(c, fiber.StatusInternalServerError, "Gagal membuat tautan berbagi.")
	}

	return c.JSON(fiber.Map{
		"token":     share.Token,
		"path":      "/share/" + share.Token,
		"views":     share.Views,
		"createdAt": share.CreatedAt.UnixMilli(),
	})
}

func (h *Handler) findShare(token string) (*models.Share, *models.Project, error) {
	var share models.Share
	err := h.DB.First(&share, "token = ?", token).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil, fiber.NewError(fiber.StatusNotFound, "Tautan berbagi tidak ditemukan.")
	}
	if err != nil {
		return nil, nil, err
	}
	var project models.Project
	err = h.DB.First(&project, "id = ?", share.ProjectID).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil, fiber.NewError(fiber.StatusNotFound, "Proyek tidak ditemukan.")
	}
	if err != nil {
		return nil, nil, err
	}
	return &share, &project, nil
}

// PublicShare returns a shared project to anyone with the token (no auth).
func (h *Handler) PublicShare(c *fiber.Ctx) error {
	share, project, err := h.findShare(c.Params("token"))
	if err != nil {
		return err
	}
	h.DB.Model(share).UpdateColumn("views", gorm.Expr("views + 1"))

	return c.JSON(fiber.Map{
		"project": toProjectDTO(project),
		"share": fiber.Map{
			"token": share.Token,
			"views": share.Views + 1,
		},
	})
}

// PublicPRD streams the PRD for a shared project without authentication.
func (h *Handler) PublicPRD(c *fiber.Ctx) error {
	_, project, err := h.findShare(c.Params("token"))
	if err != nil {
		return err
	}

	var body prdRequestBody
	_ = c.BodyParser(&body)

	if strings.TrimSpace(project.PRDPrompt) != "" {
		c.Set(fiber.HeaderContentType, "text/plain; charset=utf-8")
		return c.SendString(project.PRDPrompt)
	}

	req := buildPRDRequest(project, body.Target, body.Structured)
	h.streamPRD(c, req, func(full string) {
		h.DB.Model(project).Updates(map[string]interface{}{
			"prd_prompt":   full,
			"status":       models.StatusGenerated,
			"completeness": 100,
		})
	})
	return nil
}
