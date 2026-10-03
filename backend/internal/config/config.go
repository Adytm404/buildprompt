package config

import (
	"fmt"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// Config holds every runtime setting for the API server.
type Config struct {
	Env  string
	Port string

	DBHost      string
	DBPort      string
	DBUser      string
	DBPassword  string
	DBName      string
	DBSSLMode   string
	DatabaseURL string

	JWTSecret string
	JWTTTL    time.Duration

	AIBaseURL string
	AIAPIKey  string
	AIModel   string
	AITimeout time.Duration

	CORSOrigins string

	FreeDailyLimit   int
	FreeMonthlyLimit int
}

// Load reads configuration from .env (if present) and the process environment.
func Load() *Config {
	_ = godotenv.Load(".env", "backend/.env")

	cfg := &Config{
		Env:              getEnv("APP_ENV", "development"),
		Port:             getEnv("PORT", "8080"),
		DBHost:           getEnv("DB_HOST", "sagara.zenhosta.com"),
		DBPort:           getEnv("DB_PORT", "5432"),
		DBUser:           getEnv("DB_USER", "sagara123_prd_db"),
		DBPassword:       getEnv("DB_PASSWORD", "{ng1B-AFLXP(#5Q0"),
		DBName:           getEnv("DB_NAME", "sagara123_prd"),
		DBSSLMode:        getEnv("DB_SSLMODE", "prefer"),
		DatabaseURL:      getEnv("DATABASE_URL", ""),
		JWTSecret:        getEnv("JWT_SECRET", "buildprompt-dev-secret-change-me"),
		AIBaseURL:        strings.TrimRight(getEnv("AI_BASE_URL", "http://localhost:20128/v1"), "/"),
		AIAPIKey:         getEnv("AI_API_KEY", ""),
		AIModel:          getEnv("AI_MODEL", "cmc/deepseek/deepseek-v4.1-flash"),
		CORSOrigins:      getEnv("CORS_ORIGINS", "http://localhost:5173,http://localhost:5199,http://127.0.0.1:5173"),
		FreeDailyLimit:   getEnvInt("FREE_DAILY_LIMIT", 1),
		FreeMonthlyLimit: getEnvInt("FREE_MONTHLY_LIMIT", 5),
	}

	ttlHours := getEnvInt("JWT_TTL_HOURS", 24*7)
	cfg.JWTTTL = time.Duration(ttlHours) * time.Hour
	cfg.AITimeout = time.Duration(getEnvInt("AI_TIMEOUT_SECONDS", 180)) * time.Second

	if cfg.DatabaseURL == "" {
		cfg.DatabaseURL = cfg.buildDatabaseURL()
	}

	return cfg
}

// buildDatabaseURL assembles a libpq-style URL, percent-encoding credentials so
// passwords containing reserved characters (e.g. `{`, `(`, `#`) remain valid.
func (c *Config) buildDatabaseURL() string {
	user := url.QueryEscape(c.DBUser)
	pass := url.QueryEscape(c.DBPassword)
	return fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=%s",
		user, pass, c.DBHost, c.DBPort, c.DBName, c.DBSSLMode,
	)
}

// RedactedDatabaseURL returns the DSN with the password masked, for logging.
func (c *Config) RedactedDatabaseURL() string {
	if u, err := url.Parse(c.DatabaseURL); err == nil {
		if _, hasPass := u.User.Password(); hasPass {
			u.User = url.UserPassword(u.User.Username(), "****")
		}
		return u.String()
	}
	return "(invalid database url)"
}

func (c *Config) AllowedOrigins() []string {
	parts := strings.Split(c.CORSOrigins, ",")
	out := make([]string, 0, len(parts))
	for _, p := range parts {
		if trimmed := strings.TrimSpace(p); trimmed != "" {
			out = append(out, trimmed)
		}
	}
	return out
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok && strings.TrimSpace(value) != "" {
		return value
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if value, ok := os.LookupEnv(key); ok {
		if parsed, err := strconv.Atoi(strings.TrimSpace(value)); err == nil {
			return parsed
		}
	}
	return fallback
}
