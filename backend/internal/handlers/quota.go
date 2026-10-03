package handlers

import (
	"fmt"
	"time"

	"github.com/Adytm404/buildprompt/backend/internal/models"
	"github.com/gofiber/fiber/v2"
)

// syncUserQuotaAndPlan handles plan expiry and rolling daily/monthly counters.
func (h *Handler) syncUserQuotaAndPlan(user *models.User) {
	now := time.Now()
	changed := false

	// Check plan expiration (demote to free if expired)
	if user.Plan != models.PlanFree && user.PlanExpiresAt != nil && now.After(*user.PlanExpiresAt) {
		user.Plan = models.PlanFree
		user.DailyLimit = h.Cfg.FreeDailyLimit
		user.MonthlyLimit = h.Cfg.FreeMonthlyLimit
		user.PlanStartedAt = nil
		user.PlanExpiresAt = nil
		changed = true
	}

	// Daily rollover: midnight UTC boundary
	if user.DailyResetAt.IsZero() || !sameDay(user.DailyResetAt, now) {
		user.DailyUsed = 0
		user.DailyResetAt = now
		changed = true
	}

	// Monthly rollover: different calendar month
	if user.MonthResetAt.IsZero() || user.MonthResetAt.Year() != now.Year() || user.MonthResetAt.Month() != now.Month() {
		user.MonthlyUsed = 0
		user.MonthResetAt = now
		changed = true
	}

	if changed {
		_ = h.DB.Model(user).Updates(map[string]interface{}{
			"plan":            user.Plan,
			"daily_limit":     user.DailyLimit,
			"monthly_limit":   user.MonthlyLimit,
			"daily_used":      user.DailyUsed,
			"monthly_used":    user.MonthlyUsed,
			"daily_reset_at":  user.DailyResetAt,
			"month_reset_at":  user.MonthResetAt,
			"plan_started_at": user.PlanStartedAt,
			"plan_expires_at": user.PlanExpiresAt,
		})
	}
}

func sameDay(a, b time.Time) bool {
	ay, am, ad := a.Date()
	by, bm, bd := b.Date()
	return ay == by && am == bm && ad == bd
}

// checkQuotaAvailable verifies if the user has available daily & monthly generation budget.
func (h *Handler) checkQuotaAvailable(user *models.User) error {
	h.syncUserQuotaAndPlan(user)

	// Paid users enjoy unlimited generation
	if user.Plan != models.PlanFree {
		return nil
	}

	if user.DailyUsed >= user.DailyLimit {
		return fiber.NewError(
			fiber.StatusTooManyRequests,
			fmt.Sprintf("Kuota harian Anda untuk paket Gratis sudah habis (%d/%d hari ini). Silakan tunggu besok atau upgrade ke paket Pro untuk akses tanpa batas.", user.DailyUsed, user.DailyLimit),
		)
	}

	if user.MonthlyUsed >= user.MonthlyLimit {
		return fiber.NewError(
			fiber.StatusTooManyRequests,
			fmt.Sprintf("Kuota bulanan Anda untuk paket Gratis sudah habis (%d/%d bulan ini). Silakan upgrade ke paket Pro untuk akses tanpa batas.", user.MonthlyUsed, user.MonthlyLimit),
		)
	}

	return nil
}

// checkProjectStorageLimit ensures free users do not exceed maximum active projects (5).
func (h *Handler) checkProjectStorageLimit(user *models.User) error {
	if user.Plan != models.PlanFree {
		return nil
	}

	var count int64
	if err := h.DB.Model(&models.Project{}).Where("user_id = ?", user.ID).Count(&count).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal memeriksa batas penyimpanan proyek.")
	}

	if count >= 5 {
		return fiber.NewError(
			fiber.StatusForbidden,
			"Batas penyimpanan proyek aktif untuk paket Gratis tercapai (maksimal 5 proyek). Hapus proyek lama atau upgrade ke paket Pro untuk simpan proyek tanpa batas.",
		)
	}

	return nil
}

// checkRegenerationLimit enforces max 1 revision per document for free users.
func (h *Handler) checkRegenerationLimit(user *models.User, projectID string) error {
	if user.Plan != models.PlanFree {
		return nil
	}

	var regenCount int64
	_ = h.DB.Model(&models.UsageLog{}).
		Where("user_id = ? AND project_id = ? AND kind = ?", user.ID, projectID, "prd_regen").
		Count(&regenCount).Error

	if regenCount >= 1 {
		return fiber.NewError(
			fiber.StatusTooManyRequests,
			"Batas regenerasi untuk paket Gratis pada dokumen ini sudah tercapai (maksimal 1 kali). Upgrade ke paket Pro untuk regenerasi tanpa batas.",
		)
	}

	return nil
}

// consumeQuota records a generation event, incrementing daily/monthly counters.
func (h *Handler) consumeQuota(user *models.User, projectID, kind string) error {
	h.syncUserQuotaAndPlan(user)

	if user.Plan == models.PlanFree {
		if user.DailyUsed >= user.DailyLimit {
			return fiber.NewError(
				fiber.StatusTooManyRequests,
				fmt.Sprintf("Kuota harian Anda untuk paket Gratis sudah habis (%d/%d hari ini). Upgrade paket untuk lanjut tanpa batas.", user.DailyUsed, user.DailyLimit),
			)
		}
		if user.MonthlyUsed >= user.MonthlyLimit {
			return fiber.NewError(
				fiber.StatusTooManyRequests,
				fmt.Sprintf("Kuota bulanan Anda untuk paket Gratis sudah habis (%d/%d bulan ini). Upgrade paket untuk lanjut tanpa batas.", user.MonthlyUsed, user.MonthlyLimit),
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
	} else {
		// Paid user: track stats without blocking
		user.DailyUsed++
		user.MonthlyUsed++
		_ = h.DB.Model(user).Updates(map[string]interface{}{
			"daily_used":   user.DailyUsed,
			"monthly_used": user.MonthlyUsed,
		})
	}

	h.DB.Create(&models.UsageLog{
		UserID:    user.ID,
		ProjectID: projectID,
		Kind:      kind,
		Model:     h.Cfg.AIModel,
	})
	return nil
}
