package payment

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/Adytm404/buildprompt/backend/internal/config"
)

// ItemDetail represents a line item in Duitku invoice.
type ItemDetail struct {
	Name     string `json:"name"`
	Price    int    `json:"price"`
	Quantity int    `json:"quantity"`
}

// CustomerDetail specifies payer contact info.
type CustomerDetail struct {
	FirstName string `json:"firstName"`
	Email     string `json:"email"`
}

// CreateInvoiceRequest is the payload sent to Duitku POP createInvoice API.
type CreateInvoiceRequest struct {
	PaymentAmount   int            `json:"paymentAmount"`
	MerchantOrderID string         `json:"merchantOrderId"`
	ProductDetails  string         `json:"productDetails"`
	Email           string         `json:"email"`
	CustomerVaName  string         `json:"customerVaName"`
	ItemDetails     []ItemDetail   `json:"itemDetails"`
	CustomerDetail  CustomerDetail `json:"customerDetail"`
	CallbackURL     string         `json:"callbackUrl"`
	ReturnURL       string         `json:"returnUrl"`
	ExpiryPeriod    int            `json:"expiryPeriod"`
	PaymentMethod   string         `json:"paymentMethod,omitempty"`
}

// CreateInvoiceResponse is the response from Duitku createInvoice API.
type CreateInvoiceResponse struct {
	MerchantCode  string `json:"merchantCode"`
	Reference     string `json:"reference"`
	PaymentURL    string `json:"paymentUrl"`
	StatusCode    string `json:"statusCode"`
	StatusMessage string `json:"statusMessage"`
}

// DuitkuClient interacts with Duitku payment gateway.
type DuitkuClient struct {
	cfg        *config.Config
	httpClient *http.Client
}

// NewDuitkuClient creates a new DuitkuClient instance.
func NewDuitkuClient(cfg *config.Config) *DuitkuClient {
	return &DuitkuClient{
		cfg: cfg,
		httpClient: &http.Client{
			Timeout: 20 * time.Second,
		},
	}
}

// ComputeCreateInvoiceSignature generates HMAC-SHA256(merchantCode + timestamp, apiKey).
func ComputeCreateInvoiceSignature(merchantCode, timestamp, apiKey string) string {
	mac := hmac.New(sha256.New, []byte(apiKey))
	mac.Write([]byte(merchantCode + timestamp))
	return hex.EncodeToString(mac.Sum(nil))
}

// VerifyCallbackSignature validates HMAC-SHA256(merchantCode + amount + merchantOrderId, apiKey).
func VerifyCallbackSignature(merchantCode, amount, merchantOrderID, apiKey, givenSig string) bool {
	mac := hmac.New(sha256.New, []byte(apiKey))
	mac.Write([]byte(merchantCode + amount + merchantOrderID))
	expected := hex.EncodeToString(mac.Sum(nil))
	return strings.EqualFold(expected, strings.TrimSpace(givenSig))
}

// CreateInvoice invokes Duitku POP API to obtain DUITKU_REFERENCE and PaymentURL.
func (d *DuitkuClient) CreateInvoice(ctx context.Context, req CreateInvoiceRequest) (*CreateInvoiceResponse, error) {
	if req.CallbackURL == "" {
		req.CallbackURL = d.cfg.DuitkuCallbackURL
	}
	if req.ReturnURL == "" {
		req.ReturnURL = d.cfg.DuitkuReturnURL
	}
	if req.ExpiryPeriod <= 0 {
		req.ExpiryPeriod = d.cfg.DuitkuExpiryMin
	}

	payload, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("marshal request: %w", err)
	}

	timestamp := strconv.FormatInt(time.Now().UnixMilli(), 10)
	sig := ComputeCreateInvoiceSignature(d.cfg.DuitkuMerchantCode, timestamp, d.cfg.DuitkuAPIKey)

	url := d.cfg.DuitkuBaseURL + "/createInvoice"
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(payload))
	if err != nil {
		return nil, fmt.Errorf("create http request: %w", err)
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("x-duitku-signature", sig)
	httpReq.Header.Set("x-duitku-timestamp", timestamp)
	httpReq.Header.Set("x-duitku-merchantcode", d.cfg.DuitkuMerchantCode)

	resp, err := d.httpClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("duitku request failed: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(io.LimitReader(resp.Body, 64*1024))
	if err != nil {
		return nil, fmt.Errorf("read response: %w", err)
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("duitku api error (%d): %s", resp.StatusCode, string(bodyBytes))
	}

	var res CreateInvoiceResponse
	if err := json.Unmarshal(bodyBytes, &res); err != nil {
		return nil, fmt.Errorf("unmarshal response: %w", err)
	}

	if res.StatusCode != "00" {
		return nil, fmt.Errorf("duitku error [%s]: %s", res.StatusCode, res.StatusMessage)
	}

	return &res, nil
}

// CheckTransactionResponse is the response from Duitku transactionStatus API.
type CheckTransactionResponse struct {
	MerchantOrderID string `json:"merchantOrderId"`
	Reference       string `json:"reference"`
	Amount          string `json:"amount"`
	Fee             string `json:"fee"`
	StatusCode      string `json:"statusCode"`
	StatusMessage   string `json:"statusMessage"`
}

// CheckTransaction queries Duitku transactionStatus API to verify payment state.
func (d *DuitkuClient) CheckTransaction(ctx context.Context, merchantOrderID string) (*CheckTransactionResponse, error) {
	mac := hmac.New(sha256.New, []byte(d.cfg.DuitkuAPIKey))
	mac.Write([]byte(d.cfg.DuitkuMerchantCode + merchantOrderID))
	signature := hex.EncodeToString(mac.Sum(nil))

	reqBody := map[string]string{
		"merchantCode":    d.cfg.DuitkuMerchantCode,
		"merchantOrderId": merchantOrderID,
		"signature":       signature,
	}

	payload, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("marshal check request: %w", err)
	}

	url := "https://passport.duitku.com/webapi/api/merchant/transactionStatus"
	if strings.Contains(strings.ToLower(d.cfg.DuitkuBaseURL), "sandbox") {
		url = "https://sandbox.duitku.com/webapi/api/merchant/transactionStatus"
	}

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(payload))
	if err != nil {
		return nil, fmt.Errorf("create check http request: %w", err)
	}
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := d.httpClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("duitku check request failed: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(io.LimitReader(resp.Body, 64*1024))
	if err != nil {
		return nil, fmt.Errorf("read check response: %w", err)
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("duitku check api error (%d): %s", resp.StatusCode, string(bodyBytes))
	}

	var res CheckTransactionResponse
	if err := json.Unmarshal(bodyBytes, &res); err != nil {
		return nil, fmt.Errorf("unmarshal check response: %w", err)
	}

	return &res, nil
}
