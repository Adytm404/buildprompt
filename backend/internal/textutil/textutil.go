package textutil

import (
	"regexp"
	"strings"
)

var (
	reSummarizePrefix = regexp.MustCompile(`(?i)^(saya|aku|kami)\s+(ingin|mau|pengen|pingin|butuh)\s+(membuat|buat|bikin|punya)?\s*`)
	reFirstSentence   = regexp.MustCompile(`^[^.?!]+`)
	reTrailingPunct   = regexp.MustCompile(`[.,;:]+$`)
	reNonSlug         = regexp.MustCompile(`[^a-z0-9]+`)
	reWordBoundary    = regexp.MustCompile(`\b\w`)

	reKasir    = regexp.MustCompile(`(?i)(kasir|warung|\bpos\b|toko|retail)`)
	reBooking  = regexp.MustCompile(`(?i)(booking|barber|salon|reservasi|appointment)`)
	reKeuangan = regexp.MustCompile(`(?i)(keuangan|finansial|catatan|budget|pengeluaran)`)
	reAbsensi  = regexp.MustCompile(`(?i)(absensi|kehadiran|presensi|karyawan)`)
	reLanding  = regexp.MustCompile(`(?i)(landing|company profile|profil|bisnis|jasa)`)
	reSekolah  = regexp.MustCompile(`(?i)(sekolah|siswa|belajar|kursus|lms)`)
)

// FirstSentence returns the leading sentence of a trimmed, normalized string.
func FirstSentence(text string) string {
	clean := strings.TrimSpace(strings.Join(strings.Fields(text), " "))
	match := reFirstSentence.FindString(clean)
	if match == "" {
		return clean
	}
	return strings.TrimSpace(match)
}

// SummarizeIdea strips lead-in words ("saya ingin membuat ...") from an idea.
func SummarizeIdea(idea string) string {
	stripped := reSummarizePrefix.ReplaceAllString(strings.TrimSpace(idea), "")
	stripped = strings.TrimSpace(stripped)
	first := reTrailingPunct.ReplaceAllString(FirstSentence(stripped), "")
	if first != "" {
		return first
	}
	return strings.TrimSpace(idea)
}

// DeriveProjectName picks a human-friendly project title from an idea.
func DeriveProjectName(idea string) string {
	lower := strings.ToLower(idea)
	switch {
	case reKasir.MatchString(lower):
		return "Kasir Warung"
	case reBooking.MatchString(lower):
		return "Booking Barbershop"
	case reKeuangan.MatchString(lower):
		return "Catatan Keuangan"
	case reAbsensi.MatchString(lower):
		return "Sistem Absensi"
	case reLanding.MatchString(lower):
		return "Laman Landas Bisnis"
	case reSekolah.MatchString(lower):
		return "Platform Belajar"
	}
	summary := reWordBoundary.ReplaceAllStringFunc(SummarizeIdea(idea), strings.ToUpper)
	words := strings.Fields(summary)
	if len(words) > 3 {
		words = words[:3]
	}
	joined := strings.Join(words, " ")
	if joined == "" {
		return "Proyek Baru"
	}
	return joined
}

// Slug converts arbitrary text into a snake_case identifier.
func Slug(value, fallback string) string {
	result := strings.ToLower(strings.TrimSpace(value))
	result = reNonSlug.ReplaceAllString(result, "_")
	result = strings.Trim(result, "_")
	if result == "" {
		return fallback
	}
	return result
}

// Truncate shortens a string and appends an ellipsis when needed.
func Truncate(value string, length int) string {
	if len([]rune(value)) <= length {
		return value
	}
	runes := []rune(value)
	return strings.TrimSpace(string(runes[:length])) + "..."
}
