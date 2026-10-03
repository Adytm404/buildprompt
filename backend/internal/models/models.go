package models

import (
	"time"

	"gorm.io/datatypes"
)

// Plan identifiers shared with the frontend.
const (
	PlanFree         = "free"
	PlanProMonthly   = "pro_monthly"
	PlanProQuarterly = "pro_quarterly"
)

// Project lifecycle statuses.
const (
	StatusDraft     = "draft"
	StatusReviewing = "reviewing"
	StatusGenerated = "generated"
)

// User represents an authenticated account.
type User struct {
	ID            string     `gorm:"primaryKey;type:varchar(48)" json:"id"`
	Name          string     `gorm:"type:varchar(120);not null" json:"name"`
	Email         string     `gorm:"type:varchar(190);uniqueIndex;not null" json:"email"`
	PasswordHash  string     `gorm:"type:varchar(255);not null" json:"-"`
	Plan          string     `gorm:"type:varchar(32);not null;default:free" json:"plan"`
	DailyLimit    int        `gorm:"not null;default:1" json:"dailyLimit"`
	MonthlyLimit  int        `gorm:"not null;default:5" json:"monthlyLimit"`
	DailyUsed     int        `gorm:"not null;default:0" json:"dailyUsed"`
	MonthlyUsed   int        `gorm:"not null;default:0" json:"monthlyUsed"`
	DailyResetAt  time.Time  `json:"-"`
	MonthResetAt  time.Time  `json:"-"`
	PlanStartedAt *time.Time `json:"planStartedAt,omitempty"`
	PlanExpiresAt *time.Time `json:"planExpiresAt,omitempty"`
	CreatedAt     time.Time  `json:"joinedAt"`
	UpdatedAt     time.Time  `json:"-"`
}

// Project stores everything needed to reconstruct a PRD workspace entry.
type Project struct {
	ID            string         `gorm:"primaryKey;type:varchar(48)" json:"id"`
	UserID        string         `gorm:"type:varchar(48);index;not null" json:"-"`
	Name          string         `gorm:"type:varchar(200);not null" json:"name"`
	Idea          string         `gorm:"type:text;not null" json:"idea"`
	Badge         string         `gorm:"type:varchar(80);not null;default:'Aplikasi Web'" json:"badge"`
	Description   string         `gorm:"type:text" json:"description"`
	Answers       datatypes.JSON `gorm:"type:jsonb;not null;default:'{}'" json:"answers"`
	Questions     datatypes.JSON `gorm:"type:jsonb;not null;default:'[]'" json:"questions"`
	Analysis      datatypes.JSON `gorm:"type:jsonb" json:"analysis"`
	PRDPrompt     string         `gorm:"type:text" json:"prdPrompt"`
	AIGenerated   bool           `gorm:"not null;default:false" json:"aiGenerated"`
	FollowUpsDone bool           `gorm:"not null;default:false" json:"followUpsDone"`
	CurrentStep   int            `gorm:"not null;default:0" json:"currentStep"`
	Completed     bool           `gorm:"not null;default:false" json:"completed"`
	Status        string         `gorm:"type:varchar(24);not null;default:draft" json:"status"`
	Completeness  int            `gorm:"not null;default:12" json:"completeness"`
	CreatedAt     time.Time      `json:"createdAt"`
	UpdatedAt     time.Time      `json:"updatedAt"`
}

// Share is a public, token-addressed snapshot pointer for a project.
type Share struct {
	ID        string     `gorm:"primaryKey;type:varchar(48)" json:"id"`
	ProjectID string     `gorm:"type:varchar(48);index;not null" json:"projectId"`
	UserID    string     `gorm:"type:varchar(48);index;not null" json:"-"`
	Token     string     `gorm:"type:varchar(64);uniqueIndex;not null" json:"token"`
	Views     int        `gorm:"not null;default:0" json:"views"`
	ExpiresAt *time.Time `json:"expiresAt,omitempty"`
	CreatedAt time.Time  `json:"createdAt"`
}

// UsageLog records billable AI generations for auditing and quota checks.
type UsageLog struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    string    `gorm:"type:varchar(48);index;not null" json:"userId"`
	ProjectID string    `gorm:"type:varchar(48);index" json:"projectId"`
	Kind      string    `gorm:"type:varchar(32);not null" json:"kind"`
	Model     string    `gorm:"type:varchar(120)" json:"model"`
	CreatedAt time.Time `json:"createdAt"`
}
