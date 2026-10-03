package handlers

import (
	"fmt"
	"time"

	"github.com/Adytm404/buildprompt/backend/internal/models"
	"github.com/gofiber/fiber/v2"
)

// resetQuotaIfNeeded rolls daily/monthly counters over when the period changes.
func resetQuotaIfNeeded(user *models.User) bool {
	now := time.Now()
	changed := false

	// Daily rollover: midnight UTC boundary.
	if user.DailyResetAt.IsZero() || !sameDay(user.DailyResetAt, now) {
		user.DailyUsed = 0
		user.DailyResetAt = now
		changed = true
	}
	// Monthly rollover: different calendar month.
	if user.MonthResetAt.IsZero() || user.MonthResetAt.Year() != now.Year() || user.MonthResetAt.Month() != now.Month() {
		user.MonthlyUsed = 0
		user.MonthResetAt = now
		changed = true
	}
	return changed
}

func sameDay(a, b time.Time) bool {
	ay, am, ad := a.Date()
	by, bm, bd := b.Date()
	return ay == by && am == bm && ad == bd
}

// consumeQuota enforces the user's generation limits and records usage.
func (h *Handler) consumeQuota(user *models.User, projectID, kind string) error {
	resetQuotaIfNeeded(user)

	if user.DailyUsed >= user.DailyLimit {
		return fiber.NewError(
			fiber.StatusTooManyRequests,
			fmt.Sprintf("Kuota harian Anda sudah habis (%d/%d). Upgrade paket untuk lanjut tanpa batas.", user.DailyUsed, user.DailyLimit),
		)
	}
	if user.MonthlyUsed >= user.MonthlyLimit {
		return fiber.NewError(
			fiber.StatusTooManyRequests,
			fmt.Sprintf("Kuota bulanan Anda sudah habis (%d/%d). Upgrade paket untuk lanjut tanpa batas.", user.MonthlyUsed, user.MonthlyLimit),
		)
	}

	user.DailyUsed++
	user.MonthlyUsed++
	if err := h.DB.Model(user).Updates(map[string]interface{}{
		"daily_used":     user.DailyUsed,
		"monthly_used":   user.MonthlyUsed,
		"daily_reset_at": user.DailyResetAt,
		"month_reset_at": user.MonthResetAt,
	}).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal memperbarui kuota.")
	}

	h.DB.Create(&models.UsageLog{
		UserID:    user.ID,
		ProjectID: projectID,
		Kind:      kind,
		Model:     h.Cfg.AIModel,
	})
	return nil
}
