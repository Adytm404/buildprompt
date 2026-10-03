package handlers

import (
	"strings"
	"time"

	"github.com/Adytm404/buildprompt/backend/internal/models"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

type registerRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type authResponse struct {
	Token     string  `json:"token"`
	ExpiresAt int64   `json:"expiresAt"`
	User      userDTO `json:"user"`
}

// Register creates a new free account and returns an access token.
func (h *Handler) Register(c *fiber.Ctx) error {
	var req registerRequest
	if err := c.BodyParser(&req); err != nil {
		return badRequest(c, "Data pendaftaran tidak valid.")
	}

	name := strings.TrimSpace(req.Name)
	email := strings.ToLower(strings.TrimSpace(req.Email))
	password := req.Password

	if name == "" {
		return badRequest(c, "Nama wajib diisi.")
	}
	if !strings.Contains(email, "@") || len(email) < 5 {
		return badRequest(c, "Alamat email tidak valid.")
	}
	if len(password) < 6 {
		return badRequest(c, "Kata sandi minimal 6 karakter.")
	}

	var existing models.User
	if err := h.DB.First(&existing, "email = ?", email).Error; err == nil {
		return fail(c, fiber.StatusConflict, "Email sudah terdaftar. Silakan masuk.")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fail(c, fiber.StatusInternalServerError, "Gagal memproses kata sandi.")
	}

	now := time.Now()
	user := models.User{
		ID:           models.NewID("usr"),
		Name:         name,
		Email:        email,
		PasswordHash: string(hash),
		Plan:         models.PlanFree,
		DailyLimit:   h.Cfg.FreeDailyLimit,
		MonthlyLimit: h.Cfg.FreeMonthlyLimit,
		DailyResetAt: now,
		MonthResetAt: now,
	}
	if err := h.DB.Create(&user).Error; err != nil {
		return fail(c, fiber.StatusInternalServerError, "Gagal membuat akun.")
	}

	token, expiresAt, err := h.JWT.Generate(user.ID, user.Email)
	if err != nil {
		return fail(c, fiber.StatusInternalServerError, "Gagal membuat sesi.")
	}

	return c.Status(fiber.StatusCreated).JSON(authResponse{
		Token:     token,
		ExpiresAt: expiresAt.UnixMilli(),
		User:      toUserDTO(&user),
	})
}

// Login authenticates an existing account and returns an access token.
func (h *Handler) Login(c *fiber.Ctx) error {
	var req loginRequest
	if err := c.BodyParser(&req); err != nil {
		return badRequest(c, "Data masuk tidak valid.")
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))
	if email == "" || req.Password == "" {
		return badRequest(c, "Email dan kata sandi wajib diisi.")
	}

	var user models.User
	if err := h.DB.First(&user, "email = ?", email).Error; err != nil {
		return fail(c, fiber.StatusUnauthorized, "Email atau kata sandi salah.")
	}
	if bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)) != nil {
		return fail(c, fiber.StatusUnauthorized, "Email atau kata sandi salah.")
	}

	token, expiresAt, err := h.JWT.Generate(user.ID, user.Email)
	if err != nil {
		return fail(c, fiber.StatusInternalServerError, "Gagal membuat sesi.")
	}

	return c.JSON(authResponse{
		Token:     token,
		ExpiresAt: expiresAt.UnixMilli(),
		User:      toUserDTO(&user),
	})
}

// Me returns the currently authenticated user.
func (h *Handler) Me(c *fiber.Ctx) error {
	user, err := h.currentUser(c)
	if err != nil {
		return err
	}
	return c.JSON(fiber.Map{"user": toUserDTO(user)})
}
