package handlers

import (
	"encoding/json"
	"errors"
	"time"

	"github.com/Adytm404/buildprompt/backend/internal/ai"
	"github.com/Adytm404/buildprompt/backend/internal/auth"
	"github.com/Adytm404/buildprompt/backend/internal/config"
	"github.com/Adytm404/buildprompt/backend/internal/middleware"
	"github.com/Adytm404/buildprompt/backend/internal/models"
	"github.com/Adytm404/buildprompt/backend/internal/payment"
	"github.com/gofiber/fiber/v2"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// Handler bundles every dependency the HTTP handlers need.
type Handler struct {
	DB     *gorm.DB
	Cfg    *config.Config
	AI     *ai.Client
	JWT    *auth.Manager
	Duitku *payment.DuitkuClient
}

// New builds a Handler.
func New(db *gorm.DB, cfg *config.Config, aiClient *ai.Client, jwt *auth.Manager, duitku *payment.DuitkuClient) *Handler {
	return &Handler{DB: db, Cfg: cfg, AI: aiClient, JWT: jwt, Duitku: duitku}
}

func fail(c *fiber.Ctx, status int, message string) error {
	return c.Status(status).JSON(fiber.Map{"error": fiber.Map{"message": message}})
}

func badRequest(c *fiber.Ctx, message string) error {
	return fail(c, fiber.StatusBadRequest, message)
}

func notFound(c *fiber.Ctx, message string) error {
	return fail(c, fiber.StatusNotFound, message)
}

// currentUser loads the authenticated user from the database.
func (h *Handler) currentUser(c *fiber.Ctx) (*models.User, error) {
	userID := middleware.UserID(c)
	if userID == "" {
		return nil, fiber.NewError(fiber.StatusUnauthorized, "Sesi tidak valid.")
	}
	var user models.User
	if err := h.DB.First(&user, "id = ?", userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fiber.NewError(fiber.StatusUnauthorized, "Akun tidak ditemukan.")
		}
		return nil, err
	}
	h.syncUserQuotaAndPlan(&user)
	h.SyncUserPendingPayments(&user)
	return &user, nil
}

// userDTO is the shape the frontend AuthUser interface expects.
type userDTO struct {
	ID            string     `json:"id"`
	Name          string     `json:"name"`
	Email         string     `json:"email"`
	Plan          string     `json:"plan"`
	DailyLimit    int        `json:"dailyLimit"`
	MonthlyLimit  int        `json:"monthlyLimit"`
	DailyUsed     int        `json:"dailyUsed"`
	MonthlyUsed   int        `json:"monthlyUsed"`
	PlanStartedAt *time.Time `json:"planStartedAt,omitempty"`
	PlanExpiresAt *time.Time `json:"planExpiresAt,omitempty"`
	JoinedAt      int64      `json:"joinedAt"`
}

func toUserDTO(user *models.User) userDTO {
	return userDTO{
		ID:            user.ID,
		Name:          user.Name,
		Email:         user.Email,
		Plan:          user.Plan,
		DailyLimit:    user.DailyLimit,
		MonthlyLimit:  user.MonthlyLimit,
		DailyUsed:     user.DailyUsed,
		MonthlyUsed:   user.MonthlyUsed,
		PlanStartedAt: user.PlanStartedAt,
		PlanExpiresAt: user.PlanExpiresAt,
		JoinedAt:      user.CreatedAt.UnixMilli(),
	}
}

func jsonOr(raw datatypes.JSON, fallback string) json.RawMessage {
	if len(raw) == 0 {
		return json.RawMessage(fallback)
	}
	return json.RawMessage(raw)
}
