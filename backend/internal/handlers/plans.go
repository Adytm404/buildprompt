package handlers

import (
	"time"

	"github.com/Adytm404/buildprompt/backend/internal/models"
	"github.com/gofiber/fiber/v2"
)

// planDTO describes a purchasable plan.
type planDTO struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Price     int    `json:"price"`
	Period    string `json:"period"`
	Days      int    `json:"days"`
	Unlimited bool   `json:"unlimited"`
}

// Plans returns the available subscription plans.
func (h *Handler) Plans(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"plans": []planDTO{
			{ID: models.PlanFree, Name: "Gratis", Price: 0, Period: "selamanya", Days: 0, Unlimited: false},
			{ID: models.PlanProMonthly, Name: "Pro Bulanan", Price: 100000, Period: "bulan", Days: 30, Unlimited: true},
			{ID: models.PlanProQuarterly, Name: "Pro 3 Bulan", Price: 200000, Period: "3 bulan", Days: 90, Unlimited: true},
		},
	})
}

type upgradeRequest struct {
	Plan string `json:"plan"`
}

// UpgradePlan applies a plan change to the authenticated account.
func (h *Handler) UpgradePlan(c *fiber.Ctx) error {
	user, err := h.currentUser(c)
	if err != nil {
		return err
	}

	var req upgradeRequest
	if err := c.BodyParser(&req); err != nil {
		return badRequest(c, "Data paket tidak valid.")
	}

	now := time.Now()
	switch req.Plan {
	case models.PlanProMonthly:
		expires := now.AddDate(0, 1, 0)
		user.Plan = models.PlanProMonthly
		user.DailyLimit = 999999
		user.MonthlyLimit = 999999
		user.PlanStartedAt = &now
		user.PlanExpiresAt = &expires
	case models.PlanProQuarterly:
		expires := now.AddDate(0, 3, 0)
		user.Plan = models.PlanProQuarterly
		user.DailyLimit = 999999
		user.MonthlyLimit = 999999
		user.PlanStartedAt = &now
		user.PlanExpiresAt = &expires
	case models.PlanFree:
		user.Plan = models.PlanFree
		user.DailyLimit = h.Cfg.FreeDailyLimit
		user.MonthlyLimit = h.Cfg.FreeMonthlyLimit
		user.PlanStartedAt = nil
		user.PlanExpiresAt = nil
	default:
		return badRequest(c, "Paket tidak dikenal.")
	}

	if err := h.DB.Save(user).Error; err != nil {
		return fail(c, fiber.StatusInternalServerError, "Gagal memperbarui paket.")
	}

	return c.JSON(fiber.Map{"user": toUserDTO(user)})
}
