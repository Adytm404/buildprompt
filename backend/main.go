package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Adytm404/buildprompt/backend/internal/ai"
	"github.com/Adytm404/buildprompt/backend/internal/auth"
	"github.com/Adytm404/buildprompt/backend/internal/config"
	"github.com/Adytm404/buildprompt/backend/internal/database"
	"github.com/Adytm404/buildprompt/backend/internal/handlers"
	"github.com/Adytm404/buildprompt/backend/internal/middleware"
	"github.com/Adytm404/buildprompt/backend/internal/payment"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	cfg := config.Load()
	log.Printf("buildprompt API starting (env=%s)", cfg.Env)
	log.Printf("database: %s", cfg.RedactedDatabaseURL())

	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("fatal: %v", err)
	}
	log.Println("database: connected and migrated")

	aiClient := ai.New(cfg.AIBaseURL, cfg.AIAPIKey, cfg.AIModel, cfg.AITimeout)
	if !aiClient.Configured() {
		log.Println("warning: AI_API_KEY is empty — PRD/interview will use local fallbacks")
	}
	jwtManager := auth.NewManager(cfg.JWTSecret, cfg.JWTTTL)
	duitkuClient := payment.NewDuitkuClient(cfg)
	h := handlers.New(db, cfg, aiClient, jwtManager, duitkuClient)

	app := fiber.New(fiber.Config{
		AppName:               "buildprompt-api",
		DisableStartupMessage: true,
		BodyLimit:             4 * 1024 * 1024,
		ReadTimeout:           30 * time.Second,
		WriteTimeout:          0, // streaming responses must not be cut off
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			message := "Terjadi kesalahan pada server."
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
				message = e.Message
			} else if err != nil {
				message = err.Error()
			}
			return c.Status(code).JSON(fiber.Map{"error": fiber.Map{"message": message}})
		},
	})

	app.Use(recover.New())
	app.Use(logger.New(logger.Config{
		Format:     "[${time}] ${status} ${latency} ${method} ${path}\n",
		TimeFormat: "15:04:05",
	}))
	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.CORSOrigins,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		AllowCredentials: true,
	}))

	registerRoutes(app, h, jwtManager)

	go func() {
		quit := make(chan os.Signal, 1)
		signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
		<-quit
		log.Println("shutting down buildprompt API...")
		_ = app.ShutdownWithTimeout(5 * time.Second)
	}()

	log.Printf("buildprompt API listening on http://localhost:%s", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("server stopped with error: %v", err)
	}
}

func registerRoutes(app *fiber.App, h *handlers.Handler, jwt *auth.Manager) {
	requireAuth := middleware.RequireAuth(jwt)

	app.Get("/api/health", func(c *fiber.Ctx) error {
		sqlDB, err := h.DB.DB()
		if err != nil || sqlDB.Ping() != nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"status": "degraded"})
		}
		return c.JSON(fiber.Map{"status": "ok", "aiConfigured": h.AI.Configured()})
	})

	// Auth
	app.Post("/api/auth/register", h.Register)
	app.Post("/api/auth/login", h.Login)
	app.Get("/api/auth/me", requireAuth, h.Me)

	// Plans
	app.Get("/api/plans", h.Plans)
	app.Post("/api/plans/upgrade", requireAuth, h.UpgradePlan)

	// Payment (Duitku POP)
	app.Post("/api/payment/create-invoice", requireAuth, h.CreatePaymentInvoice)
	app.Post("/api/payment/duitku/callback", h.DuitkuCallback)
	app.Get("/api/payment/status/:orderId", requireAuth, h.GetPaymentStatus)

	// Projects
	app.Get("/api/projects", requireAuth, h.ListProjects)
	app.Post("/api/projects", requireAuth, h.CreateProject)
	app.Get("/api/projects/:id", requireAuth, h.GetProject)
	app.Patch("/api/projects/:id", requireAuth, h.UpdateProject)
	app.Delete("/api/projects/:id", requireAuth, h.DeleteProject)
	app.Post("/api/projects/:id/duplicate", requireAuth, h.DuplicateProject)
	app.Post("/api/projects/:id/share", requireAuth, h.CreateShare)

	// AI
	app.Post("/api/ai/interview", requireAuth, h.GenerateInterview)
	app.Post("/api/ai/interview/followups", requireAuth, h.GenerateFollowUps)
	app.Post("/api/ai/prd", requireAuth, h.GeneratePRD)

	// Public sharing (no auth)
	app.Get("/api/share/:token", h.PublicShare)
	app.Post("/api/share/:token/prd", h.PublicPRD)
}
