package models

import (
	"fmt"
	"strings"

	"github.com/google/uuid"
)

// NewID returns a compact prefixed identifier, e.g. proj_1f0c... .
func NewID(prefix string) string {
	raw := strings.ReplaceAll(uuid.NewString(), "-", "")
	return fmt.Sprintf("%s_%s", prefix, raw[:24])
}
