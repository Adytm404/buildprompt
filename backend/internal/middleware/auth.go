package middleware

import (
	"strings"

	"github.com/Adytm404/buildprompt/backend/internal/auth"
	"github.com/gofiber/fiber/v2"
)

// ContextUserID is the fiber locals key holding the authenticated user id.
const ContextUserID = "userID"

// ContextEmail is the fiber locals key holding the authenticated email.
const ContextEmail = "userEmail"

// RequireAuth validates the Bearer token and stores identity in locals.
func RequireAuth(manager *auth.Manager) fiber.Handler {
	return func(c *fiber.Ctx) error {
		header := c.Get("Authorization")
		if header == "" {
			return fiber.NewError(fiber.StatusUnauthorized, "Token autentikasi tidak ditemukan.")
		}
		parts := strings.SplitN(header, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			return fiber.NewError(fiber.StatusUnauthorized, "Format token tidak valid.")
		}
		claims, err := manager.Parse(strings.TrimSpace(parts[1]))
		if err != nil {
			return fiber.NewError(fiber.StatusUnauthorized, "Sesi tidak valid atau sudah kedaluwarsa.")
		}
		c.Locals(ContextUserID, claims.UserID)
		c.Locals(ContextEmail, claims.Email)
		return c.Next()
	}
}

// UserID returns the authenticated user id from locals.
func UserID(c *fiber.Ctx) string {
	if value, ok := c.Locals(ContextUserID).(string); ok {
		return value
	}
	return ""
}
