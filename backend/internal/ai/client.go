package ai

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

// Message is a single OpenAI-compatible chat message.
type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// Options tunes a completion request.
type Options struct {
	Temperature float64
	MaxTokens   int
	JSON        bool
}

// Client talks to any OpenAI-compatible chat completions endpoint.
type Client struct {
	baseURL        string
	apiKey         string
	model          string
	defaultTimeout time.Duration
	http           *http.Client
}

// New builds an AI client. timeout is exposed via DefaultTimeout so callers can
// scope per-request contexts; the HTTP client itself has no global deadline so
// long-running streams are not truncated.
func New(baseURL, apiKey, model string, timeout time.Duration) *Client {
	return &Client{
		baseURL:        strings.TrimRight(baseURL, "/"),
		apiKey:         apiKey,
		model:          model,
		defaultTimeout: timeout,
		http:           &http.Client{},
	}
}

// Model returns the configured model identifier.
func (c *Client) Model() string { return c.model }

// DefaultTimeout returns the configured per-request timeout.
func (c *Client) DefaultTimeout() time.Duration { return c.defaultTimeout }

// Configured reports whether an API key has been supplied.
func (c *Client) Configured() bool { return c.apiKey != "" }

type chatRequest struct {
	Model          string      `json:"model"`
	Messages       []Message   `json:"messages"`
	Temperature    float64     `json:"temperature"`
	MaxTokens      int         `json:"max_tokens,omitempty"`
	ResponseFormat interface{} `json:"response_format,omitempty"`
	Stream         bool        `json:"stream,omitempty"`
}

type chatResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
	Error *struct {
		Message string `json:"message"`
	} `json:"error"`
}

// Chat performs a blocking completion and returns the assistant text.
func (c *Client) Chat(ctx context.Context, messages []Message, opts Options) (string, error) {
	if !c.Configured() {
		return "", fmt.Errorf("ai: API key is not configured")
	}
	body := chatRequest{
		Model:       c.model,
		Messages:    messages,
		Temperature: opts.Temperature,
		MaxTokens:   opts.MaxTokens,
		Stream:      false,
	}
	if opts.JSON {
		body.ResponseFormat = map[string]string{"type": "json_object"}
	}

	raw, err := c.do(ctx, body)
	if err != nil {
		// Some compatible servers reject response_format; retry once without it.
		if opts.JSON {
			body.ResponseFormat = nil
			raw, err = c.do(ctx, body)
		}
		if err != nil {
			return "", err
		}
	}

	var parsed chatResponse
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return "", fmt.Errorf("ai: decode response: %w", err)
	}
	if parsed.Error != nil && parsed.Error.Message != "" {
		return "", fmt.Errorf("ai: %s", parsed.Error.Message)
	}
	if len(parsed.Choices) == 0 {
		return "", fmt.Errorf("ai: empty response")
	}

	content := parsed.Choices[0].Message.Content

	// Some gateways accept response_format but silently return empty content.
	// Retry once in plain mode so callers still get a usable answer.
	if opts.JSON && strings.TrimSpace(content) == "" {
		body.ResponseFormat = nil
		if retryRaw, retryErr := c.do(ctx, body); retryErr == nil {
			var retried chatResponse
			if json.Unmarshal(retryRaw, &retried) == nil && len(retried.Choices) > 0 {
				return retried.Choices[0].Message.Content, nil
			}
		}
	}

	return content, nil
}

// ChatJSON performs a completion and unmarshals the (possibly fenced) JSON body.
func (c *Client) ChatJSON(ctx context.Context, messages []Message, opts Options, out interface{}) error {
	opts.JSON = true
	content, err := c.Chat(ctx, messages, opts)
	if err != nil {
		return err
	}
	return decodeJSON(content, out)
}

// Stream performs a streaming completion, invoking onDelta for each token chunk,
// and returns the accumulated full text.
func (c *Client) Stream(ctx context.Context, messages []Message, opts Options, onDelta func(string)) (string, error) {
	if !c.Configured() {
		return "", fmt.Errorf("ai: API key is not configured")
	}
	body := chatRequest{
		Model:       c.model,
		Messages:    messages,
		Temperature: opts.Temperature,
		MaxTokens:   opts.MaxTokens,
		Stream:      true,
	}
	payload, err := json.Marshal(body)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL+"/chat/completions", bytes.NewReader(payload))
	if err != nil {
		return "", err
	}
	c.setHeaders(req)

	resp, err := c.http.Do(req)
	if err != nil {
		return "", fmt.Errorf("ai: request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		raw, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
		return "", fmt.Errorf("ai: status %d: %s", resp.StatusCode, strings.TrimSpace(string(raw)))
	}

	var full strings.Builder
	scanner := bufio.NewScanner(resp.Body)
	scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if !strings.HasPrefix(line, "data:") {
			continue
		}
		data := strings.TrimSpace(strings.TrimPrefix(line, "data:"))
		if data == "" || data == "[DONE]" {
			continue
		}
		var chunk struct {
			Choices []struct {
				Delta struct {
					Content string `json:"content"`
				} `json:"delta"`
			} `json:"choices"`
		}
		if err := json.Unmarshal([]byte(data), &chunk); err != nil {
			continue
		}
		if len(chunk.Choices) == 0 {
			continue
		}
		delta := chunk.Choices[0].Delta.Content
		if delta == "" {
			continue
		}
		full.WriteString(delta)
		if onDelta != nil {
			onDelta(delta)
		}
	}
	if err := scanner.Err(); err != nil {
		return full.String(), fmt.Errorf("ai: stream read: %w", err)
	}
	return full.String(), nil
}

func (c *Client) do(ctx context.Context, body chatRequest) ([]byte, error) {
	payload, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL+"/chat/completions", bytes.NewReader(payload))
	if err != nil {
		return nil, err
	}
	c.setHeaders(req)

	resp, err := c.http.Do(req)
	if err != nil {
		return nil, fmt.Errorf("ai: request failed: %w", err)
	}
	defer resp.Body.Close()

	raw, err := io.ReadAll(io.LimitReader(resp.Body, 8<<20))
	if err != nil {
		return nil, fmt.Errorf("ai: read body: %w", err)
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		msg := strings.TrimSpace(string(raw))
		var parsed chatResponse
		if json.Unmarshal(raw, &parsed) == nil && parsed.Error != nil && parsed.Error.Message != "" {
			msg = parsed.Error.Message
		}
		return nil, fmt.Errorf("ai: status %d: %s", resp.StatusCode, msg)
	}
	return raw, nil
}

func (c *Client) setHeaders(req *http.Request) {
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.apiKey)
}

// decodeJSON strips markdown fences and extracts the first JSON object/array.
func decodeJSON(content string, out interface{}) error {
	cleaned := strings.TrimSpace(content)
	cleaned = strings.TrimPrefix(cleaned, "```json")
	cleaned = strings.TrimPrefix(cleaned, "```")
	cleaned = strings.TrimSuffix(cleaned, "```")
	cleaned = strings.TrimSpace(cleaned)

	start := strings.IndexAny(cleaned, "{[")
	end := strings.LastIndexAny(cleaned, "}]")
	if start == -1 || end == -1 || end <= start {
		return fmt.Errorf("ai: response did not contain JSON")
	}
	if err := json.Unmarshal([]byte(cleaned[start:end+1]), out); err != nil {
		return fmt.Errorf("ai: invalid JSON: %w", err)
	}
	return nil
}
