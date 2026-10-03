package handlers

import (
	"bufio"
	"context"
	"encoding/json"
	"strings"

	"github.com/Adytm404/buildprompt/backend/internal/ai"
	"github.com/Adytm404/buildprompt/backend/internal/models"
	projectdomain "github.com/Adytm404/buildprompt/backend/internal/project"
	"github.com/gofiber/fiber/v2"
)

type interviewRequest struct {
	Idea string `json:"idea"`
}

// GenerateInterview returns the adaptive question set for an idea.
func (h *Handler) GenerateInterview(c *fiber.Ctx) error {
	if _, err := h.currentUser(c); err != nil {
		return err
	}
	var req interviewRequest
	if err := c.BodyParser(&req); err != nil {
		return badRequest(c, "Data wawancara tidak valid.")
	}
	idea := strings.TrimSpace(req.Idea)
	if idea == "" {
		return badRequest(c, "Ide proyek wajib diisi.")
	}

	ctx, cancel := context.WithTimeout(context.Background(), h.AI.DefaultTimeout())
	defer cancel()

	result := h.AI.GenerateInterview(ctx, idea)
	return c.JSON(fiber.Map{
		"analysis":  result.Analysis,
		"questions": result.Questions,
		"source":    result.Source,
	})
}

type followUpRequest struct {
	Idea        string                 `json:"idea"`
	Answers     map[string]interface{} `json:"answers"`
	ExistingIDs []string               `json:"existingIds"`
}

// GenerateFollowUps returns up to two contextual follow-up questions.
func (h *Handler) GenerateFollowUps(c *fiber.Ctx) error {
	if _, err := h.currentUser(c); err != nil {
		return err
	}
	var req followUpRequest
	if err := c.BodyParser(&req); err != nil {
		return badRequest(c, "Data lanjutan tidak valid.")
	}
	if strings.TrimSpace(req.Idea) == "" {
		return badRequest(c, "Ide proyek wajib diisi.")
	}

	ctx, cancel := context.WithTimeout(context.Background(), h.AI.DefaultTimeout())
	defer cancel()

	questions := h.AI.GenerateFollowUps(ctx, req.Idea, req.Answers, req.ExistingIDs)
	return c.JSON(fiber.Map{"questions": questions})
}

type prdRequestBody struct {
	ProjectID  string                 `json:"projectId"`
	Target     string                 `json:"target"`
	Structured map[string]interface{} `json:"structured"`
}

func buildPRDRequest(project *models.Project, target string, structured map[string]interface{}) ai.PRDRequest {
	var analysis map[string]interface{}
	if len(project.Analysis) > 0 {
		_ = json.Unmarshal(project.Analysis, &analysis)
	}
	answers := projectdomain.DecodeAnswers(project.Answers)
	if structured == nil {
		structured = map[string]interface{}{}
	}
	return ai.PRDRequest{
		ProjectName: project.Name,
		Idea:        project.Idea,
		Analysis:    analysis,
		Answers:     answers,
		Target:      target,
		Structured:  structured,
	}
}

// GeneratePRD streams a PRD prompt for an authenticated user's project.
func (h *Handler) GeneratePRD(c *fiber.Ctx) error {
	user, err := h.currentUser(c)
	if err != nil {
		return err
	}
	var body prdRequestBody
	if err := c.BodyParser(&body); err != nil {
		return badRequest(c, "Data PRD tidak valid.")
	}
	if strings.TrimSpace(body.ProjectID) == "" {
		return badRequest(c, "Project ID wajib diisi.")
	}
	project, err := h.findProject(user.ID, body.ProjectID)
	if err != nil {
		return err
	}

	if err := h.consumeQuota(user, project.ID, "prd"); err != nil {
		return err
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

// streamPRD writes the PRD text to the response, falling back to the local
// renderer when the AI provider fails, then invokes onComplete with the result.
func (h *Handler) streamPRD(c *fiber.Ctx, req ai.PRDRequest, onComplete func(string)) {
	c.Set(fiber.HeaderContentType, "text/plain; charset=utf-8")
	c.Set(fiber.HeaderCacheControl, "no-cache, no-transform")
	c.Set("X-Accel-Buffering", "no")

	ctx, cancel := context.WithTimeout(context.Background(), h.AI.DefaultTimeout())

	c.Context().SetBodyStreamWriter(func(w *bufio.Writer) {
		defer cancel()

		var full strings.Builder
		text, err := h.AI.StreamPRD(ctx, req, func(delta string) {
			full.WriteString(delta)
			_, _ = w.WriteString(delta)
			_ = w.Flush()
		})

		if err != nil || strings.TrimSpace(text) == "" {
			local := ai.LocalPRD(req)
			if full.Len() == 0 {
				_, _ = w.WriteString(local)
			}
			_ = w.Flush()
			if onComplete != nil {
				onComplete(local)
			}
			return
		}

		if onComplete != nil {
			onComplete(strings.TrimSpace(text))
		}
	})
}
