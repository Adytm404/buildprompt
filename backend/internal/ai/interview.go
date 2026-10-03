package ai

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"

	"github.com/Adytm404/buildprompt/backend/internal/prompts"
	"github.com/Adytm404/buildprompt/backend/internal/textutil"
)

// QuestionOption mirrors the frontend QuestionOption contract.
type QuestionOption struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description,omitempty"`
	Icon        string `json:"icon,omitempty"`
	Preselected bool   `json:"preselected,omitempty"`
	Visual      string `json:"visual,omitempty"`
}

// VisibleWhen is a serializable replacement for the client-side showIf closure.
type VisibleWhen struct {
	ID string   `json:"id"`
	In []string `json:"in"`
}

// Question mirrors the frontend Question contract.
type Question struct {
	ID          string           `json:"id"`
	Type        string           `json:"type"`
	Label       string           `json:"label,omitempty"`
	Title       string           `json:"title"`
	Description string           `json:"description,omitempty"`
	Helper      string           `json:"helper,omitempty"`
	Placeholder string           `json:"placeholder,omitempty"`
	Options     []QuestionOption `json:"options,omitempty"`
	Contextual  bool             `json:"contextual,omitempty"`
	AllowCustom bool             `json:"allowCustom,omitempty"`
	AutoAdvance bool             `json:"autoAdvance"`
	Columns     int              `json:"columns,omitempty"`
	Source      string           `json:"source"`
	VisibleWhen *VisibleWhen     `json:"visibleWhen,omitempty"`
}

// IdeaAnalysis mirrors the frontend IdeaAnalysis contract.
type IdeaAnalysis struct {
	Summary           string   `json:"summary"`
	Kind              string   `json:"kind"`
	PlatformHint      string   `json:"platformHint"`
	AppType           string   `json:"appType"`
	SuggestedFeatures []string `json:"suggestedFeatures"`
	Notes             string   `json:"notes,omitempty"`
}

// InterviewResult is returned to the client for the interview wizard.
type InterviewResult struct {
	Analysis  IdeaAnalysis `json:"analysis"`
	Questions []Question   `json:"questions"`
	Source    string       `json:"source"` // "ai" | "local"
}

var allowedIcons = map[string]bool{
	"Globe": true, "Smartphone": true, "Monitor": true, "Sparkles": true,
}

var validTypes = map[string]bool{
	"single": true, "multiple": true, "text": true, "confirm": true,
}

func asString(v interface{}) string {
	if s, ok := v.(string); ok {
		return strings.TrimSpace(s)
	}
	return ""
}

func asBool(v interface{}) (bool, bool) {
	if b, ok := v.(bool); ok {
		return b, true
	}
	return false, false
}

func asMap(v interface{}) map[string]interface{} {
	if m, ok := v.(map[string]interface{}); ok {
		return m
	}
	return map[string]interface{}{}
}

func asSlice(v interface{}) []interface{} {
	if s, ok := v.([]interface{}); ok {
		return s
	}
	return nil
}

func normalizeOption(raw interface{}, index int) *QuestionOption {
	record := asMap(raw)
	title := asString(record["title"])
	if title == "" {
		return nil
	}
	id := textutil.Slug(asString(record["id"]), fmt.Sprintf("opt_%d", index))
	if id == "" {
		id = textutil.Slug(title, fmt.Sprintf("opt_%d", index))
	}
	option := &QuestionOption{
		ID:          id,
		Title:       title,
		Description: asString(record["description"]),
	}
	if icon := asString(record["icon"]); allowedIcons[icon] {
		option.Icon = icon
	}
	if pre, ok := asBool(record["preselected"]); ok {
		option.Preselected = pre
	}
	if visual := asString(record["visual"]); visual != "" {
		option.Visual = visual
	}
	return option
}

func normalizeQuestion(raw interface{}, index int) *Question {
	record := asMap(raw)
	title := asString(record["title"])
	if title == "" {
		return nil
	}

	qtype := asString(record["type"])
	if !validTypes[qtype] {
		qtype = "single"
	}

	options := make([]QuestionOption, 0)
	for i, rawOpt := range asSlice(record["options"]) {
		if opt := normalizeOption(rawOpt, i); opt != nil {
			options = append(options, *opt)
		}
	}

	if (qtype == "single" || qtype == "multiple") && len(options) < 2 {
		qtype = "text"
	}
	if qtype == "confirm" && len(options) < 2 {
		return nil
	}

	question := &Question{
		ID:          textutil.Slug(asString(record["id"]), fmt.Sprintf("q_%d", index)),
		Type:        qtype,
		Label:       asString(record["label"]),
		Title:       title,
		Description: asString(record["description"]),
		Helper:      asString(record["helper"]),
		Placeholder: asString(record["placeholder"]),
		Contextual:  false,
		Source:      "ai",
	}
	if qtype == "single" || qtype == "multiple" || qtype == "confirm" {
		question.Options = options
	}
	if contextual, ok := asBool(record["contextual"]); ok {
		question.Contextual = contextual
	}
	if allowCustom, ok := asBool(record["allowCustom"]); ok {
		question.AllowCustom = allowCustom
	} else {
		question.AllowCustom = qtype == "multiple"
	}
	if autoAdvance, ok := asBool(record["autoAdvance"]); ok {
		question.AutoAdvance = autoAdvance
	} else {
		question.AutoAdvance = qtype == "single"
	}
	if columns, ok := record["columns"].(float64); ok {
		if int(columns) == 2 {
			question.Columns = 2
		} else if int(columns) == 1 {
			question.Columns = 1
		}
	}
	return question
}

// NormalizeQuestions sanitizes raw model output into the frontend contract.
func NormalizeQuestions(raw interface{}) []Question {
	items := asSlice(raw)
	if items == nil {
		if m, ok := raw.(map[string]interface{}); ok {
			items = asSlice(m["questions"])
		}
	}
	out := make([]Question, 0, len(items))
	seen := map[string]bool{}
	for index, item := range items {
		q := normalizeQuestion(item, index)
		if q == nil {
			continue
		}
		id := q.ID
		suffix := 2
		for seen[id] {
			id = fmt.Sprintf("%s_%d", q.ID, suffix)
			suffix++
		}
		seen[id] = true
		q.ID = id
		out = append(out, *q)
	}
	return out
}

func normalizeAnalysis(raw interface{}, idea string) IdeaAnalysis {
	record := asMap(raw)
	features := make([]string, 0)
	for _, item := range asSlice(record["suggestedFeatures"]) {
		if s, ok := item.(string); ok && strings.TrimSpace(s) != "" {
			features = append(features, strings.TrimSpace(s))
		}
		if len(features) >= 8 {
			break
		}
	}
	summary := asString(record["summary"])
	if summary == "" {
		summary = textutil.SummarizeIdea(idea)
	}
	kind := asString(record["kind"])
	if kind == "" {
		kind = detectKind(idea)
	}
	platformHint := asString(record["platformHint"])
	if platformHint == "" {
		platformHint = "unsure"
	}
	appType := asString(record["appType"])
	if appType == "" {
		appType = "web application"
	}
	return IdeaAnalysis{
		Summary:           summary,
		Kind:              kind,
		PlatformHint:      platformHint,
		AppType:           appType,
		SuggestedFeatures: features,
		Notes:             asString(record["notes"]),
	}
}

func detectKind(idea string) string {
	lower := strings.ToLower(idea)
	switch {
	case regexpMatch(`kasir|warung|\bpos\b|toko|retail|transaksi|stok`, lower):
		return "pos"
	case regexpMatch(`booking|barber|salon|reservasi|appointment`, lower):
		return "booking"
	case regexpMatch(`keuangan|finansial|catatan|budget|pengeluaran|pemasukan`, lower):
		return "finance"
	case regexpMatch(`absensi|kehadiran|presensi`, lower):
		return "attendance"
	case regexpMatch(`landing|company profile|profil|portofolio`, lower):
		return "landing"
	default:
		return "generic"
	}
}

// GenerateInterview asks the model for adaptive questions, falling back to the
// deterministic local question set when the AI is unavailable.
func (c *Client) GenerateInterview(ctx context.Context, idea string) InterviewResult {
	messages := []Message{
		{Role: "system", Content: prompts.InterviewSystemPrompt()},
		{Role: "user", Content: prompts.InterviewUserPrompt(idea)},
	}

	// Try JSON mode first (best structure), then a plain completion. Some
	// gateways handle one but not the other, so both are attempted before
	// giving up on the model entirely.
	attempts := []Options{
		{Temperature: 0.3, MaxTokens: 4096, JSON: true},
		{Temperature: 0.2, MaxTokens: 4096},
	}

	lastLen := 0
	for _, opts := range attempts {
		raw, err := c.Chat(ctx, messages, opts)
		if err != nil {
			log.Printf("interview: AI attempt failed (json=%v): %v", opts.JSON, err)
			continue
		}
		lastLen = len(raw)
		if strings.TrimSpace(raw) == "" {
			log.Printf("interview: AI returned empty response (json=%v)", opts.JSON)
			continue
		}
		if result, ok := parseInterviewResponse(raw, idea); ok {
			return result
		}
		log.Printf("interview: could not parse AI response (json=%v, len=%d)", opts.JSON, len(raw))
	}

	log.Printf("interview: using local fallback (last raw length=%d)", lastLen)
	return localInterview(idea)
}

// parseInterviewResponse tolerates fenced and truncated JSON payloads.
func parseInterviewResponse(raw, idea string) (InterviewResult, bool) {
	var payload struct {
		Analysis  interface{} `json:"analysis"`
		Questions interface{} `json:"questions"`
	}

	if err := json.Unmarshal(extractObject(raw), &payload); err != nil {
		// Salvage complete question objects from a truncated response.
		salvaged := salvageQuestions(raw)
		if len(salvaged) == 0 {
			return InterviewResult{}, false
		}
		payload.Questions = salvaged
	}

	questions := NormalizeQuestions(payload.Questions)
	if len(questions) < 4 {
		// Last resort: salvage directly from the raw text.
		questions = NormalizeQuestions(salvageQuestions(raw))
		if len(questions) < 4 {
			return InterviewResult{}, false
		}
	}
	return InterviewResult{
		Analysis:  normalizeAnalysis(payload.Analysis, idea),
		Questions: questions,
		Source:    "ai",
	}, true
}

// salvageQuestions extracts balanced JSON objects from the "questions" array,
// which recovers usable questions even when the model output was truncated.
func salvageQuestions(raw string) []interface{} {
	key := strings.Index(raw, `"questions"`)
	if key == -1 {
		return nil
	}
	open := strings.Index(raw[key:], "[")
	if open == -1 {
		return nil
	}

	start := key + open + 1
	depth := 0
	objStart := -1
	inString := false
	escaped := false

	var objects []interface{}
	for i := start; i < len(raw); i++ {
		ch := raw[i]
		if inString {
			if escaped {
				escaped = false
				continue
			}
			switch ch {
			case '\\':
				escaped = true
			case '"':
				inString = false
			}
			continue
		}
		switch ch {
		case '"':
			inString = true
		case '{':
			if depth == 0 {
				objStart = i
			}
			depth++
		case '}':
			if depth > 0 {
				depth--
				if depth == 0 && objStart != -1 {
					var obj interface{}
					if json.Unmarshal([]byte(raw[objStart:i+1]), &obj) == nil {
						objects = append(objects, obj)
					}
					objStart = -1
				}
			}
		case ']':
			if depth == 0 {
				return objects
			}
		}
	}
	return objects
}

func localInterview(idea string) InterviewResult {
	return InterviewResult{
		Analysis: IdeaAnalysis{
			Summary:           textutil.SummarizeIdea(idea),
			Kind:              detectKind(idea),
			PlatformHint:      "unsure",
			AppType:           "web application",
			SuggestedFeatures: []string{},
		},
		Questions: fallbackQuestions(idea),
		Source:    "local",
	}
}

// GenerateFollowUps asks for up to two extra contextual questions.
func (c *Client) GenerateFollowUps(ctx context.Context, idea string, answers map[string]interface{}, existingIDs []string) []Question {
	answersJSON, _ := json.Marshal(answers)
	messages := []Message{
		{Role: "system", Content: prompts.FollowUpSystemPrompt()},
		{Role: "user", Content: prompts.FollowUpUserPrompt(idea, string(answersJSON), existingIDs)},
	}

	var questions []Question
	for _, opts := range []Options{
		{Temperature: 0.4, MaxTokens: 1500, JSON: true},
		{Temperature: 0.4, MaxTokens: 1500},
	} {
		raw, err := c.Chat(ctx, messages, opts)
		if err != nil || strings.TrimSpace(raw) == "" {
			continue
		}
		var payload struct {
			Questions interface{} `json:"questions"`
		}
		if json.Unmarshal(extractObject(raw), &payload) == nil {
			questions = NormalizeQuestions(payload.Questions)
		} else {
			questions = NormalizeQuestions(salvageQuestions(raw))
		}
		if len(questions) > 0 {
			break
		}
	}

	seen := map[string]bool{}
	for _, id := range existingIDs {
		seen[id] = true
	}
	out := make([]Question, 0, 2)
	for _, q := range questions {
		if seen[q.ID] {
			continue
		}
		q.Contextual = true
		out = append(out, q)
		if len(out) >= 2 {
			break
		}
	}
	return out
}

// extractObject returns the JSON body of a model response, tolerating fences.
func extractObject(content string) []byte {
	cleaned := strings.TrimSpace(content)
	cleaned = strings.TrimPrefix(cleaned, "```json")
	cleaned = strings.TrimPrefix(cleaned, "```")
	cleaned = strings.TrimSuffix(cleaned, "```")
	cleaned = strings.TrimSpace(cleaned)
	start := strings.IndexAny(cleaned, "{[")
	end := strings.LastIndexAny(cleaned, "}]")
	if start == -1 || end <= start {
		return []byte("{}")
	}
	return []byte(cleaned[start : end+1])
}
