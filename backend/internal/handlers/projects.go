package handlers

import (
	"encoding/json"
	"errors"
	"strings"
	"time"

	"github.com/Adytm404/buildprompt/backend/internal/ai"
	"github.com/Adytm404/buildprompt/backend/internal/models"
	projectdomain "github.com/Adytm404/buildprompt/backend/internal/project"
	"github.com/gofiber/fiber/v2"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// projectDTO is the wire shape consumed by the frontend Project interface.
type projectDTO struct {
	ID            string          `json:"id"`
	Name          string          `json:"name"`
	Idea          string          `json:"idea"`
	Badge         string          `json:"badge"`
	Description   string          `json:"description"`
	Answers       json.RawMessage `json:"answers"`
	Questions     json.RawMessage `json:"questions,omitempty"`
	Analysis      json.RawMessage `json:"analysis,omitempty"`
	PRDPrompt     string          `json:"prdPrompt,omitempty"`
	AIGenerated   bool            `json:"aiGenerated,omitempty"`
	FollowUpsDone bool            `json:"followUpsDone,omitempty"`
	CurrentStep   int             `json:"currentStep"`
	Completed     bool            `json:"completed"`
	Status        string          `json:"status"`
	Completeness  int             `json:"completeness"`
	CreatedAt     int64           `json:"createdAt"`
	UpdatedAt     int64           `json:"updatedAt"`
}

func toProjectDTO(p *models.Project) projectDTO {
	analysis := jsonOr(p.Analysis, "null")
	dto := projectDTO{
		ID:            p.ID,
		Name:          p.Name,
		Idea:          p.Idea,
		Badge:         p.Badge,
		Description:   p.Description,
		Answers:       jsonOr(p.Answers, "{}"),
		Questions:     jsonOr(p.Questions, "[]"),
		Analysis:      analysis,
		AIGenerated:   p.AIGenerated,
		FollowUpsDone: p.FollowUpsDone,
		CurrentStep:   p.CurrentStep,
		Completed:     p.Completed,
		Status:        p.Status,
		Completeness:  p.Completeness,
		CreatedAt:     p.CreatedAt.UnixMilli(),
		UpdatedAt:     p.UpdatedAt.UnixMilli(),
	}
	if strings.TrimSpace(p.PRDPrompt) != "" {
		dto.PRDPrompt = p.PRDPrompt
	}
	return dto
}

type createProjectRequest struct {
	Idea string `json:"idea"`
}

// ListProjects returns all projects owned by the authenticated user.
func (h *Handler) ListProjects(c *fiber.Ctx) error {
	user, err := h.currentUser(c)
	if err != nil {
		return err
	}
	var projects []models.Project
	if err := h.DB.Where("user_id = ?", user.ID).Order("updated_at DESC").Find(&projects).Error; err != nil {
		return fail(c, fiber.StatusInternalServerError, "Gagal memuat proyek.")
	}
	out := make([]projectDTO, 0, len(projects))
	for i := range projects {
		out = append(out, toProjectDTO(&projects[i]))
	}
	return c.JSON(fiber.Map{"projects": out})
}

// CreateProject creates a draft project from a raw idea.
func (h *Handler) CreateProject(c *fiber.Ctx) error {
	user, err := h.currentUser(c)
	if err != nil {
		return err
	}
	var req createProjectRequest
	if err := c.BodyParser(&req); err != nil {
		return badRequest(c, "Data proyek tidak valid.")
	}
	idea := strings.TrimSpace(req.Idea)
	if idea == "" {
		return badRequest(c, "Ide proyek wajib diisi.")
	}

	project := models.Project{
		ID:           models.NewID("proj"),
		UserID:       user.ID,
		Name:         projectdomain.SuggestedName(idea),
		Idea:         idea,
		Badge:        "Aplikasi Web",
		Description:  projectdomain.BuildDescription(idea),
		Answers:      datatypes.JSON([]byte("{}")),
		Questions:    datatypes.JSON([]byte("[]")),
		Status:       models.StatusDraft,
		Completeness: 12,
	}
	if err := h.DB.Create(&project).Error; err != nil {
		return fail(c, fiber.StatusInternalServerError, "Gagal membuat proyek.")
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"project": toProjectDTO(&project)})
}

// GetProject returns a single project owned by the user.
func (h *Handler) GetProject(c *fiber.Ctx) error {
	user, err := h.currentUser(c)
	if err != nil {
		return err
	}
	project, err := h.findProject(user.ID, c.Params("id"))
	if err != nil {
		return err
	}
	return c.JSON(fiber.Map{"project": toProjectDTO(project)})
}

type projectPatch struct {
	Name          *string         `json:"name"`
	Idea          *string         `json:"idea"`
	Badge         *string         `json:"badge"`
	Description   *string         `json:"description"`
	Answers       json.RawMessage `json:"answers"`
	Questions     json.RawMessage `json:"questions"`
	Analysis      json.RawMessage `json:"analysis"`
	PRDPrompt     *string         `json:"prdPrompt"`
	AIGenerated   *bool           `json:"aiGenerated"`
	FollowUpsDone *bool           `json:"followUpsDone"`
	CurrentStep   *int            `json:"currentStep"`
	Completed     *bool           `json:"completed"`
	Status        *string         `json:"status"`
	Completeness  *int            `json:"completeness"`
}

// UpdateProject applies a partial update, recomputing badge/completeness.
func (h *Handler) UpdateProject(c *fiber.Ctx) error {
	user, err := h.currentUser(c)
	if err != nil {
		return err
	}
	project, err := h.findProject(user.ID, c.Params("id"))
	if err != nil {
		return err
	}

	var patch projectPatch
	if err := c.BodyParser(&patch); err != nil {
		return badRequest(c, "Data perubahan tidak valid.")
	}

	answersChanged := false
	questionsChanged := false

	if patch.Name != nil {
		name := strings.TrimSpace(*patch.Name)
		if name == "" {
			name = "Project tanpa nama"
		}
		project.Name = name
	}
	if patch.Idea != nil {
		project.Idea = strings.TrimSpace(*patch.Idea)
	}
	if patch.Description != nil {
		project.Description = *patch.Description
	}
	if patch.Answers != nil {
		project.Answers = datatypes.JSON(patch.Answers)
		answersChanged = true
	}
	if patch.Questions != nil {
		project.Questions = datatypes.JSON(patch.Questions)
		questionsChanged = true
	}
	if patch.Analysis != nil {
		project.Analysis = datatypes.JSON(patch.Analysis)
	}
	if patch.PRDPrompt != nil {
		project.PRDPrompt = *patch.PRDPrompt
	}
	if patch.AIGenerated != nil {
		project.AIGenerated = *patch.AIGenerated
	}
	if patch.FollowUpsDone != nil {
		project.FollowUpsDone = *patch.FollowUpsDone
	}
	if patch.CurrentStep != nil {
		project.CurrentStep = *patch.CurrentStep
	}
	if patch.Completed != nil {
		project.Completed = *patch.Completed
	}
	if patch.Status != nil {
		project.Status = *patch.Status
	}

	if patch.Badge != nil {
		project.Badge = *patch.Badge
	} else if answersChanged {
		project.Badge = projectdomain.DeriveBadge(projectdomain.DecodeAnswers(project.Answers))
	}

	if patch.Completeness != nil {
		project.Completeness = *patch.Completeness
	} else if answersChanged || questionsChanged {
		questions := projectdomain.DecodeQuestions(project.Questions)
		answers := projectdomain.DecodeAnswers(project.Answers)
		project.Completeness = projectdomain.ComputeCompleteness(questions, answers)
	}

	if project.Completed && project.Status == models.StatusDraft {
		project.Status = models.StatusReviewing
	}

	if err := h.DB.Save(project).Error; err != nil {
		return fail(c, fiber.StatusInternalServerError, "Gagal menyimpan perubahan.")
	}
	return c.JSON(fiber.Map{"project": toProjectDTO(project)})
}

// DeleteProject removes a project and its public shares.
func (h *Handler) DeleteProject(c *fiber.Ctx) error {
	user, err := h.currentUser(c)
	if err != nil {
		return err
	}
	project, err := h.findProject(user.ID, c.Params("id"))
	if err != nil {
		return err
	}
	h.DB.Where("project_id = ?", project.ID).Delete(&models.Share{})
	if err := h.DB.Delete(project).Error; err != nil {
		return fail(c, fiber.StatusInternalServerError, "Gagal menghapus proyek.")
	}
	return c.JSON(fiber.Map{"ok": true})
}

// DuplicateProject clones a project under a new identifier.
func (h *Handler) DuplicateProject(c *fiber.Ctx) error {
	user, err := h.currentUser(c)
	if err != nil {
		return err
	}
	original, err := h.findProject(user.ID, c.Params("id"))
	if err != nil {
		return err
	}
	now := time.Now()
	copyProject := models.Project{
		ID:            models.NewID("proj"),
		UserID:        user.ID,
		Name:          original.Name + " (copy)",
		Idea:          original.Idea,
		Badge:         original.Badge,
		Description:   original.Description,
		Answers:       original.Answers,
		Questions:     original.Questions,
		Analysis:      original.Analysis,
		PRDPrompt:     original.PRDPrompt,
		AIGenerated:   original.AIGenerated,
		FollowUpsDone: original.FollowUpsDone,
		CurrentStep:   original.CurrentStep,
		Completed:     original.Completed,
		Status:        original.Status,
		Completeness:  original.Completeness,
		CreatedAt:     now,
		UpdatedAt:     now,
	}
	if err := h.DB.Create(&copyProject).Error; err != nil {
		return fail(c, fiber.StatusInternalServerError, "Gagal menduplikasi proyek.")
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"project": toProjectDTO(&copyProject)})
}

// findProject loads a project scoped to its owner.
func (h *Handler) findProject(userID, projectID string) (*models.Project, error) {
	var project models.Project
	err := h.DB.First(&project, "id = ? AND user_id = ?", projectID, userID).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, fiber.NewError(fiber.StatusNotFound, "Proyek tidak ditemukan.")
	}
	if err != nil {
		return nil, err
	}
	return &project, nil
}

// questionsFromRaw decodes a project's questions for AI handlers.
func questionsFromRaw(raw datatypes.JSON) []ai.Question {
	return projectdomain.DecodeQuestions(raw)
}
