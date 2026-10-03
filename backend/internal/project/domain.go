package project

import (
	"encoding/json"
	"strings"

	"regexp"

	"github.com/Adytm404/buildprompt/backend/internal/ai"
	"github.com/Adytm404/buildprompt/backend/internal/textutil"
)

var (
	rePosIdea     = regexp.MustCompile(`(?i)(kasir|warung|\bpos\b|toko|retail)`)
	reBookingIdea = regexp.MustCompile(`(?i)(booking|barber|salon|reservasi)`)
	reFinanceIdea = regexp.MustCompile(`(?i)(keuangan|finansial|catatan|budget)`)
)

// DeriveBadge selects a human badge based on interview answers, matching the
// frontend blueprint logic.
func DeriveBadge(answers map[string]interface{}) string {
	platform := stringValue(answers["platform"])
	websiteType := stringValue(answers["website_type"])

	switch platform {
	case "mobile":
		return "Aplikasi Seluler"
	case "desktop":
		return "Aplikasi Desktop"
	}
	switch websiteType {
	case "landing":
		return "Laman Landas"
	case "company":
		return "Profil Perusahaan"
	case "marketplace":
		return "Lokapasar"
	}
	return "Aplikasi Web"
}

// BuildDescription creates a short Indonesian description from an idea.
func BuildDescription(idea string) string {
	switch {
	case rePosIdea.MatchString(idea):
		return "Aplikasi kasir berbasis web untuk membantu warung mengelola transaksi, produk, stok, dan laporan sederhana."
	case reBookingIdea.MatchString(idea):
		return "Aplikasi booking berbasis web agar pelanggan dapat memesan jadwal dan mengelola ketersediaan karyawan."
	case reFinanceIdea.MatchString(idea):
		return "Aplikasi pencatatan keuangan sederhana untuk memantau pemasukan, pengeluaran, dan ringkasan bulanan."
	default:
		return "Aplikasi berbasis web yang dirancang dari ide Anda, lengkap dengan fitur utama dan tampilan yang mudah digunakan."
	}
}

// SuggestedName is a convenience wrapper around textutil.DeriveProjectName.
func SuggestedName(idea string) string {
	return textutil.DeriveProjectName(idea)
}

func stringValue(v interface{}) string {
	if s, ok := v.(string); ok {
		return s
	}
	return ""
}

// visible reports whether a question should be shown for the given answers.
func visible(q ai.Question, answers map[string]interface{}) bool {
	if q.VisibleWhen == nil {
		return true
	}
	raw, ok := answers[q.VisibleWhen.ID]
	if !ok {
		return false
	}
	candidates := toStringSlice(raw)
	for _, candidate := range candidates {
		for _, allowed := range q.VisibleWhen.In {
			if candidate == allowed {
				return true
			}
		}
	}
	return false
}

func toStringSlice(raw interface{}) []string {
	switch value := raw.(type) {
	case string:
		return []string{value}
	case []interface{}:
		out := make([]string, 0, len(value))
		for _, item := range value {
			if s, ok := item.(string); ok {
				out = append(out, s)
			}
		}
		return out
	case []string:
		return value
	}
	return nil
}

func isAnswered(q ai.Question, answers map[string]interface{}) bool {
	value, ok := answers[q.ID]
	if !ok {
		return false
	}
	switch q.Type {
	case "multiple":
		return len(toStringSlice(value)) > 0
	case "text", "confirm":
		return strings.TrimSpace(stringValue(value)) != ""
	default:
		return stringValue(value) != ""
	}
}

// ComputeCompleteness mirrors the client completeness algorithm (12–92%).
func ComputeCompleteness(questions []ai.Question, answers map[string]interface{}) int {
	visibleQuestions := make([]ai.Question, 0, len(questions))
	for _, q := range questions {
		if visible(q, answers) {
			visibleQuestions = append(visibleQuestions, q)
		}
	}
	if len(visibleQuestions) == 0 {
		return 12
	}
	answered := 0
	for _, q := range visibleQuestions {
		if isAnswered(q, answers) {
			answered++
		}
	}
	ratio := float64(answered) / float64(len(visibleQuestions))
	return int(12 + 80*ratio + 0.5)
}

// DecodeQuestions parses stored JSON questions.
func DecodeQuestions(raw []byte) []ai.Question {
	if len(raw) == 0 {
		return nil
	}
	var questions []ai.Question
	if err := json.Unmarshal(raw, &questions); err != nil {
		return nil
	}
	return questions
}

// DecodeAnswers parses stored JSON answers.
func DecodeAnswers(raw []byte) map[string]interface{} {
	if len(raw) == 0 {
		return map[string]interface{}{}
	}
	var answers map[string]interface{}
	if err := json.Unmarshal(raw, &answers); err != nil {
		return map[string]interface{}{}
	}
	return answers
}
