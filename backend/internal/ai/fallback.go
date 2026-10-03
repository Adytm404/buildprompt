package ai

import (
	"fmt"
	"regexp"

	"github.com/Adytm404/buildprompt/backend/internal/textutil"
)

func regexpMatch(pattern, value string) bool {
	re, err := regexp.Compile(pattern)
	if err != nil {
		return false
	}
	return re.MatchString(value)
}

func isPos(idea string) bool {
	return regexpMatch(`(?i)(kasir|warung|\bpos\b|toko|retail|transaksi|stok)`, idea)
}

func isBooking(idea string) bool {
	return regexpMatch(`(?i)(booking|barber|salon|reservasi|appointment|jadwal)`, idea)
}

func featureOptions(idea string) []QuestionOption {
	if isPos(idea) {
		return []QuestionOption{
			{ID: "pos", Title: "Kasir / POS", Preselected: true},
			{ID: "products", Title: "Produk", Preselected: true},
			{ID: "stock", Title: "Stok", Preselected: true},
			{ID: "transactions", Title: "Transaksi", Preselected: true},
			{ID: "reports", Title: "Laporan", Preselected: true},
			{ID: "customers", Title: "Pelanggan"},
			{ID: "suppliers", Title: "Supplier"},
			{ID: "branches", Title: "Multi cabang"},
			{ID: "staff", Title: "Manajemen karyawan"},
		}
	}
	if isBooking(idea) {
		return []QuestionOption{
			{ID: "booking", Title: "Booking / Reservasi", Preselected: true},
			{ID: "schedule", Title: "Jadwal & ketersediaan", Preselected: true},
			{ID: "staff", Title: "Manajemen karyawan", Preselected: true},
			{ID: "services", Title: "Daftar layanan", Preselected: true},
			{ID: "reminder", Title: "Pengingat / notifikasi"},
			{ID: "payment", Title: "Pembayaran"},
			{ID: "reports", Title: "Laporan"},
			{ID: "customers", Title: "Pelanggan"},
		}
	}
	return []QuestionOption{
		{ID: "dashboard", Title: "Dashboard", Preselected: true},
		{ID: "data", Title: "Kelola data", Preselected: true},
		{ID: "reports", Title: "Laporan", Preselected: true},
		{ID: "auth", Title: "Akun pengguna", Preselected: true},
		{ID: "notifications", Title: "Notifikasi"},
		{ID: "search", Title: "Pencarian & filter"},
		{ID: "export", Title: "Export data"},
		{ID: "payment", Title: "Pembayaran"},
	}
}

func websiteVisible() *VisibleWhen {
	return &VisibleWhen{ID: "platform", In: []string{"website", "unsure"}}
}

// fallbackQuestions mirrors the deterministic client question set so the
// interview can proceed even when the AI provider is unreachable.
func fallbackQuestions(idea string) []Question {
	summary := textutil.SummarizeIdea(idea)
	contextualTitle := "Apakah data perlu diperbarui otomatis saat ada aktivitas baru?"
	if isPos(idea) {
		contextualTitle = "Apakah stok barang harus otomatis berkurang setiap kali transaksi berhasil?"
	}

	return []Question{
		{
			ID:          "idea_confirmation",
			Type:        "confirm",
			Label:       "Pertama, pastikan kami memahami ide Anda",
			Title:       fmt.Sprintf("Anda ingin membuat %s. Benar begitu?", summary),
			Helper:      "Jika ada yang kurang sesuai, Anda dapat memperbaikinya sekarang.",
			Placeholder: "Tuliskan ide Anda dengan lebih jelas...",
			AutoAdvance: false,
			Source:      "local",
			Options: []QuestionOption{
				{ID: "correct", Title: "Ya, sudah benar"},
				{ID: "fix", Title: "Belum, saya mau perbaiki"},
			},
		},
		{
			ID:          "platform",
			Type:        "single",
			Title:       "Aplikasi ini ingin digunakan di mana?",
			Helper:      `Tidak yakin? Pilih "Bantu pilihkan" dan kami akan merekomendasikannya.`,
			AutoAdvance: true,
			Columns:     2,
			Source:      "local",
			Options: []QuestionOption{
				{ID: "website", Title: "Website", Description: "Bisa dibuka melalui browser di HP dan laptop.", Icon: "Globe"},
				{ID: "mobile", Title: "Aplikasi Seluler", Description: "Aplikasi Android atau iOS.", Icon: "Smartphone"},
				{ID: "desktop", Title: "Aplikasi Desktop", Description: "Aplikasi untuk Windows, macOS, atau Linux.", Icon: "Monitor"},
				{ID: "unsure", Title: "Belum tahu", Description: "Bantu saya menentukan pilihan terbaik.", Icon: "Sparkles"},
			},
		},
		{
			ID:          "website_type",
			Type:        "single",
			Title:       "Website seperti apa yang ingin Anda buat?",
			AutoAdvance: true,
			Source:      "local",
			VisibleWhen: websiteVisible(),
			Options: []QuestionOption{
				{ID: "landing", Title: "Laman Landas", Description: "Website sederhana untuk memperkenalkan produk, jasa, atau bisnis."},
				{ID: "company", Title: "Profil Perusahaan", Description: "Website informasi perusahaan atau organisasi."},
				{ID: "webapp", Title: "Aplikasi Web", Description: "Website dengan fitur seperti login, dasbor, data, atau transaksi."},
				{ID: "marketplace", Title: "Lokapasar / Platform", Description: "Website yang mempertemukan banyak pengguna."},
				{ID: "unsure", Title: "Saya belum tahu", Description: "Bantu tentukan dari ide saya."},
			},
		},
		{
			ID:          "user_type",
			Type:        "multiple",
			Title:       "Siapa yang akan menggunakan aplikasi ini?",
			Helper:      "Boleh pilih lebih dari satu.",
			AllowCustom: true,
			Columns:     2,
			Source:      "local",
			Options: []QuestionOption{
				{ID: "self", Title: "Saya sendiri"},
				{ID: "owner", Title: "Pemilik usaha"},
				{ID: "staff", Title: "Karyawan"},
				{ID: "customer", Title: "Pelanggan"},
				{ID: "admin", Title: "Admin"},
				{ID: "public", Title: "Publik / siapa saja"},
			},
		},
		{
			ID:          "login",
			Type:        "single",
			Title:       "Apakah pengguna perlu masuk ke akun terlebih dahulu?",
			AutoAdvance: true,
			Source:      "local",
			Options: []QuestionOption{
				{ID: "yes", Title: "Ya", Description: "Pengguna memiliki akun masing-masing."},
				{ID: "no", Title: "Tidak", Description: "Semua fitur bisa digunakan tanpa login."},
				{ID: "unsure", Title: "Belum tahu", Description: "Bantu tentukan."},
			},
		},
		{
			ID:          "data",
			Type:        "single",
			Title:       "Apakah aplikasi perlu menyimpan data?",
			Helper:      "Misalnya data pengguna, produk, transaksi, catatan, booking, atau laporan.",
			AutoAdvance: true,
			Source:      "local",
			Options: []QuestionOption{
				{ID: "yes", Title: "Ya", Description: "Ada data yang perlu disimpan dan diolah."},
				{ID: "no", Title: "Tidak", Description: "Aplikasi hanya menampilkan informasi."},
				{ID: "unsure", Title: "Belum tahu", Description: "Bantu tentukan."},
			},
		},
		{
			ID:          "features",
			Type:        "multiple",
			Title:       "Fitur apa saja yang menurutmu penting?",
			Helper:      "Tenang, nanti kami juga akan merekomendasikan fitur yang mungkin kamu lewatkan.",
			AllowCustom: true,
			Columns:     2,
			Source:      "local",
			Options:     featureOptions(idea),
		},
		{
			ID:          "design_style",
			Type:        "single",
			Title:       "Anda ingin tampilannya terasa seperti apa?",
			AutoAdvance: true,
			Columns:     2,
			Source:      "local",
			Options: []QuestionOption{
				{ID: "minimal", Title: "Bersih & Minimalis", Description: "Banyak ruang kosong dan sederhana.", Visual: "minimal"},
				{ID: "saas", Title: "SaaS Modern", Description: "Tampilan aplikasi modern dan profesional.", Visual: "saas"},
				{ID: "fun", Title: "Ceria & Bersahabat", Description: "Lebih berwarna dan komunikatif.", Visual: "fun"},
				{ID: "corporate", Title: "Korporat & Profesional", Description: "Formal dan profesional.", Visual: "corporate"},
				{ID: "auto", Title: "Bebaskan AI", Description: "Biarkan sistem menentukan berdasarkan aplikasinya.", Visual: "auto"},
			},
		},
		{
			ID:          "device_priority",
			Type:        "single",
			Title:       "Aplikasi ini paling sering akan dibuka dari mana?",
			AutoAdvance: true,
			Columns:     2,
			Source:      "local",
			VisibleWhen: websiteVisible(),
			Options: []QuestionOption{
				{ID: "mobile", Title: "HP"},
				{ID: "desktop", Title: "Laptop / komputer"},
				{ID: "both", Title: "Keduanya sama penting"},
				{ID: "unsure", Title: "Belum tahu"},
			},
		},
		{
			ID:          "deployment",
			Type:        "single",
			Title:       "Apakah Anda sudah tahu aplikasi ini nantinya akan dipasang di mana?",
			Helper:      "Jangan khawatir, kami dapat merekomendasikan pilihan yang paling mudah untuk Anda.",
			AutoAdvance: true,
			Source:      "local",
			Options: []QuestionOption{
				{ID: "unsure", Title: "Belum tahu", Description: "Rekomendasikan yang paling mudah."},
				{ID: "shared", Title: "Shared Hosting / cPanel", Description: "Paket hosting umum, cukup upload."},
				{ID: "vps", Title: "VPS", Description: "Server sendiri dengan kontrol lebih."},
				{ID: "vercel", Title: "Vercel / Cloud", Description: "Platform cloud modern."},
			},
		},
		{
			ID:          "dynamic_stock",
			Type:        "single",
			Label:       "Pertanyaan berdasarkan ide Anda",
			Title:       contextualTitle,
			Contextual:  true,
			AutoAdvance: true,
			Source:      "local",
			Options: []QuestionOption{
				{ID: "yes", Title: "Ya"},
				{ID: "no", Title: "Tidak"},
				{ID: "unsure", Title: "Belum tahu"},
			},
		},
	}
}
