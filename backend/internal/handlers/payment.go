package handlers

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/Adytm404/buildprompt/backend/internal/models"
	"github.com/Adytm404/buildprompt/backend/internal/payment"
	"github.com/gofiber/fiber/v2"
)

type createInvoiceBody struct {
	Plan          string `json:"plan"`
	PaymentMethod string `json:"paymentMethod,omitempty"`
}

func generateOrderID(plan string) string {
	buf := make([]byte, 4)
	_, _ = rand.Read(buf)
	prefix := "M"
	if plan == models.PlanProQuarterly {
		prefix = "Q"
	}
	return fmt.Sprintf("BP-%s-%d-%s", prefix, time.Now().Unix(), hex.EncodeToString(buf))
}

// CreatePaymentInvoice creates a Duitku POP invoice and records a pending transaction.
func (h *Handler) CreatePaymentInvoice(c *fiber.Ctx) error {
	user, err := h.currentUser(c)
	if err != nil {
		return err
	}

	var req createInvoiceBody
	if err := c.BodyParser(&req); err != nil {
		return badRequest(c, "Data pesanan tidak valid.")
	}

	var amount int
	var productDetails string
	switch req.Plan {
	case models.PlanProMonthly:
		amount = 100000
		productDetails = "Langganan buildprompt Pro (1 Bulan)"
	case models.PlanProQuarterly:
		amount = 200000
		productDetails = "Langganan buildprompt Pro (3 Bulan)"
	default:
		return badRequest(c, "Paket langganan tidak valid.")
	}

	orderID := generateOrderID(req.Plan)
	tx := models.Transaction{
		ID:              models.NewID("tx"),
		UserID:          user.ID,
		MerchantOrderID: orderID,
		Plan:            req.Plan,
		Amount:          amount,
		Status:          models.PaymentPending,
		PaymentMethod:   strings.ToUpper(strings.TrimSpace(req.PaymentMethod)),
	}

	if err := h.DB.Create(&tx).Error; err != nil {
		return fail(c, fiber.StatusInternalServerError, "Gagal membuat catatan transaksi.")
	}

	// Request invoice from Duitku POP
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	duitkuReq := payment.CreateInvoiceRequest{
		PaymentAmount:   amount,
		MerchantOrderID: orderID,
		ProductDetails:  productDetails,
		Email:           user.Email,
		CustomerVaName:  user.Name,
		PaymentMethod:   tx.PaymentMethod,
		ItemDetails: []payment.ItemDetail{
			{
				Name:     productDetails,
				Price:    amount,
				Quantity: 1,
			},
		},
		CustomerDetail: payment.CustomerDetail{
			FirstName: user.Name,
			Email:     user.Email,
		},
	}

	res, err := h.Duitku.CreateInvoice(ctx, duitkuReq)
	if err != nil {
		log.Printf("payment: createInvoice failed for order %s: %v", orderID, err)
		tx.Status = models.PaymentFailed
		_ = h.DB.Save(&tx)
		return fail(c, fiber.StatusBadGateway, fmt.Sprintf("Gagal menghubungi gateway pembayaran: %v", err))
	}

	tx.DuitkuReference = res.Reference
	tx.PaymentURL = res.PaymentURL
	_ = h.DB.Save(&tx)

	return c.JSON(fiber.Map{
		"orderId":    orderID,
		"reference":  res.Reference,
		"paymentUrl": res.PaymentURL,
		"amount":     amount,
		"plan":       req.Plan,
	})
}

// DuitkuCallback receives HTTP POST callbacks (x-www-form-urlencoded) from Duitku server.
func (h *Handler) DuitkuCallback(c *fiber.Ctx) error {
	merchantCode := c.FormValue("merchantCode")
	amount := c.FormValue("amount")
	merchantOrderID := c.FormValue("merchantOrderId")
	signature := c.FormValue("signature")
	resultCode := c.FormValue("resultCode")
	paymentCode := c.FormValue("paymentCode")
	reference := c.FormValue("reference")

	log.Printf("payment callback: order=%s code=%s amount=%s ref=%s", merchantOrderID, resultCode, amount, reference)

	if merchantCode == "" || amount == "" || merchantOrderID == "" || signature == "" {
		return c.Status(fiber.StatusBadRequest).SendString("Bad Parameter")
	}

	valid := payment.VerifyCallbackSignature(merchantCode, amount, merchantOrderID, h.Cfg.DuitkuAPIKey, signature)
	if !valid {
		log.Printf("payment callback: bad signature for order %s", merchantOrderID)
		return c.Status(fiber.StatusBadRequest).SendString("Bad Signature")
	}

	var tx models.Transaction
	if err := h.DB.First(&tx, "merchant_order_id = ?", merchantOrderID).Error; err != nil {
		log.Printf("payment callback: order not found: %s", merchantOrderID)
		return c.Status(fiber.StatusNotFound).SendString("Order Not Found")
	}

	now := time.Now()
	if resultCode == "00" {
		if tx.Status != models.PaymentSuccess {
			tx.Status = models.PaymentSuccess
			tx.PaymentMethod = paymentCode
			tx.PaidAt = &now
			_ = h.DB.Save(&tx)

			// Upgrade user account
			var user models.User
			if err := h.DB.First(&user, "id = ?", tx.UserID).Error; err == nil {
				var expires time.Time
				if tx.Plan == models.PlanProQuarterly {
					expires = now.AddDate(0, 3, 0)
					user.Plan = models.PlanProQuarterly
				} else {
					expires = now.AddDate(0, 1, 0)
					user.Plan = models.PlanProMonthly
				}
				user.DailyLimit = 999999
				user.MonthlyLimit = 999999
				user.PlanStartedAt = &now
				user.PlanExpiresAt = &expires
				_ = h.DB.Save(&user)
				log.Printf("payment callback: user %s successfully upgraded to %s", user.ID, user.Plan)
			}
		}
	} else {
		tx.Status = models.PaymentFailed
		_ = h.DB.Save(&tx)
	}

	return c.SendString("OK")
}

// GetPaymentStatus checks current transaction status for frontend polling.
func (h *Handler) GetPaymentStatus(c *fiber.Ctx) error {
	user, err := h.currentUser(c)
	if err != nil {
		return err
	}

	orderID := c.Params("orderId")
	var tx models.Transaction
	if err := h.DB.First(&tx, "merchant_order_id = ? AND user_id = ?", orderID, user.ID).Error; err != nil {
		return notFound(c, "Transaksi tidak ditemukan.")
	}

	return c.JSON(fiber.Map{
		"orderId":   tx.MerchantOrderID,
		"status":    tx.Status,
		"plan":      tx.Plan,
		"amount":    tx.Amount,
		"reference": tx.DuitkuReference,
		"paidAt":    tx.PaidAt,
		"createdAt": tx.CreatedAt,
	})
}
