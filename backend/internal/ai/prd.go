package ai

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/Adytm404/buildprompt/backend/internal/prompts"
)

// Structured mirrors the client-computed blueprint hints sent with a PRD request.
type Structured struct {
	Platform string   `json:"platform"`
	Badge    string   `json:"badge"`
	Users    []string `json:"users"`
	Roles    []struct {
		Title       string `json:"title"`
		Description string `json:"description"`
	} `json:"roles"`
	HasData       bool   `json:"hasData"`
	LoginRequired bool   `json:"loginRequired"`
	DesignStyle   string `json:"designStyle"`
	Deployment    string `json:"deployment"`
	Stack         []struct {
		Label string `json:"label"`
		Value string `json:"value"`
		Icon  string `json:"icon"`
	} `json:"stack"`
	Features []struct {
		ID          string   `json:"id"`
		Title       string   `json:"title"`
		Description string   `json:"description"`
		Items       []string `json:"items"`
	} `json:"features"`
	Pages []struct {
		Path        string `json:"path"`
		Label       string `json:"label"`
		Group       string `json:"group"`
		Description string `json:"description"`
	} `json:"pages"`
	Database struct {
		Simple []struct {
			Title       string `json:"title"`
			Description string `json:"description"`
		} `json:"simple"`
		Tables []struct {
			Name        string `json:"name"`
			Description string `json:"description"`
			Columns     []struct {
				Name string `json:"name"`
				Type string `json:"type"`
				Note string `json:"note"`
			} `json:"columns"`
		} `json:"tables"`
	} `json:"database"`
	API struct {
		Simple    string `json:"simple"`
		Endpoints []struct {
			Method      string `json:"method"`
			Path        string `json:"path"`
			Description string `json:"description"`
		} `json:"endpoints"`
	} `json:"api"`
}

// PRDRequest is the payload accepted by the PRD endpoint.
type PRDRequest struct {
	ProjectName string                 `json:"projectName"`
	Idea        string                 `json:"idea"`
	Analysis    map[string]interface{} `json:"analysis"`
	Answers     map[string]interface{} `json:"answers"`
	Target      string                 `json:"target"`
	Structured  map[string]interface{} `json:"structured"`
}

func (r PRDRequest) target() string {
	if strings.TrimSpace(r.Target) == "" {
		return "Generic"
	}
	return r.Target
}

// StreamPRD streams the generated markdown, invoking onDelta per chunk.
func (c *Client) StreamPRD(ctx context.Context, req PRDRequest, onDelta func(string)) (string, error) {
	analysisJSON, _ := json.Marshal(req.Analysis)
	answersJSON, _ := json.Marshal(req.Answers)
	structuredJSON, _ := json.Marshal(req.Structured)

	userPrompt := prompts.PRDUserPrompt(prompts.PRDContext{
		ProjectName: req.ProjectName,
		Idea:        req.Idea,
		Analysis:    string(analysisJSON),
		Answers:     string(answersJSON),
		Target:      req.target(),
		Structured:  string(structuredJSON),
	})

	text, err := c.Stream(ctx, []Message{
		{Role: "system", Content: prompts.PRDSystemPrompt()},
		{Role: "user", Content: userPrompt},
	}, Options{Temperature: 0.5, MaxTokens: 6000}, onDelta)
	if err != nil {
		return "", err
	}
	if strings.TrimSpace(text) == "" {
		return LocalPRD(req), nil
	}
	return strings.TrimSpace(text), nil
}

// LocalPRD renders a deterministic markdown PRD from structured hints, used as a
// graceful fallback when the AI provider is unavailable.
func LocalPRD(req PRDRequest) string {
	raw, _ := json.Marshal(req.Structured)
	var s Structured
	_ = json.Unmarshal(raw, &s)

	platform := s.Platform
	if platform == "" {
		platform = "Aplikasi Web"
	}
	appType := strings.ToLower(platform)

	var b strings.Builder
	fmt.Fprintf(&b, "# %s — PRD & BUILD PROMPT\n\n", req.ProjectName)
	fmt.Fprintf(&b, "> Target AI coding: **%s**\n\n", req.target())
	b.WriteString("Gunakan dokumen ini sebagai spesifikasi lengkap. Implementasikan aplikasi secara bertahap dan pastikan setiap bagian terpenuhi.\n\n")

	b.WriteString("## 1. Ringkasan Produk\n")
	fmt.Fprintf(&b, "- %s adalah %s yang dibuat dari ide: \"%s\".\n", req.ProjectName, appType, strings.TrimSpace(req.Idea))
	if s.DesignStyle != "" {
		fmt.Fprintf(&b, "- Tampilan dirancang dengan gaya %s agar mudah digunakan pengguna non-teknis.\n", s.DesignStyle)
	}
	b.WriteString("\n")

	b.WriteString("## 2. Problem\n")
	if s.HasData {
		b.WriteString("- Proses kerja masih manual sehingga rawan kesalahan dan sulit direkap.\n- Data penting belum terpusat dan sulit diakses kembali.\n\n")
	} else {
		b.WriteString("- Informasi belum tersaji secara terstruktur dan mudah diakses.\n- Pengguna kesulitan menemukan informasi yang dibutuhkan.\n\n")
	}

	b.WriteString("## 3. Target Users & Roles\n")
	if len(s.Roles) > 0 {
		for _, role := range s.Roles {
			fmt.Fprintf(&b, "- **%s** — %s\n", role.Title, role.Description)
		}
	} else if len(s.Users) > 0 {
		for _, u := range s.Users {
			fmt.Fprintf(&b, "- %s\n", u)
		}
	} else {
		b.WriteString("- Pengguna umum\n")
	}
	b.WriteString("\n")

	b.WriteString("## 4. Goals\n")
	b.WriteString("- Menyediakan solusi digital yang cepat, rapi, dan mudah dipakai.\n- Mengurangi pekerjaan manual dan risiko kesalahan data.\n- Memberi ringkasan informasi yang bisa langsung dipakai untuk mengambil keputusan.\n\n")

	b.WriteString("## 5. Platform\n")
	fmt.Fprintf(&b, "- %s\n\n", platform)

	b.WriteString("## 6. Tech Stack\n")
	if len(s.Stack) > 0 {
		for _, item := range s.Stack {
			fmt.Fprintf(&b, "- %s: %s\n", item.Label, item.Value)
		}
	} else {
		b.WriteString("- Framework: Next.js (App Router, TypeScript)\n- Styling: Tailwind CSS\n- Basis Data: SQLite (Prisma / Drizzle ORM)\n- Hosting: Vercel / Cloud Platform\n")
	}
	b.WriteString("\n")

	b.WriteString("## 7. Design / UI Style\n")
	design := s.DesignStyle
	if design == "" {
		design = "Modern, bersih, dan responsif"
	}
	fmt.Fprintf(&b, "- %s\n- Gunakan hierarki visual yang jelas, kontras memadai, dan navigasi sederhana.\n\n", design)

	b.WriteString("## 8. Autentikasi & Data\n")
	if s.LoginRequired {
		b.WriteString("- Wajib login. Gunakan autentikasi berbasis sesi/JWT dengan hashing password yang aman.\n")
	} else {
		b.WriteString("- Tidak wajib login untuk fitur utama.\n")
	}
	if s.HasData {
		b.WriteString("- Simpan data secara persisten dan terstruktur.\n")
	}
	b.WriteString("\n")

	b.WriteString("## 9. Fitur Utama\n")
	if len(s.Features) > 0 {
		for i, feature := range s.Features {
			fmt.Fprintf(&b, "### 9.%d %s\n", i+1, feature.Title)
			fmt.Fprintf(&b, "%s\n", feature.Description)
			for _, item := range feature.Items {
				fmt.Fprintf(&b, "- %s\n", item)
			}
			b.WriteString("\n")
		}
	} else {
		b.WriteString("- Dashboard\n- Kelola data\n- Laporan\n\n")
	}

	b.WriteString("## 10. Halaman\n")
	if len(s.Pages) > 0 {
		for _, page := range s.Pages {
			fmt.Fprintf(&b, "- `%s` — %s\n", page.Path, page.Label)
		}
	} else {
		b.WriteString("- `/` Landing\n- `/dashboard` Ringkasan\n")
	}
	b.WriteString("\n")

	b.WriteString("## 11. User Flow\n")
	b.WriteString("1. Pengguna membuka aplikasi dan memahami tujuan utama.\n2. Pengguna masuk/menavigasi ke fitur yang dibutuhkan.\n3. Pengguna melakukan aksi utama dan mendapat umpan balik jelas.\n4. Data tersimpan dan dapat dilihat kembali melalui ringkasan/laporan.\n\n")

	b.WriteString("## 12. Business Rules\n")
	b.WriteString("- Validasi input wajib sebelum menyimpan data.\n- Semua aksi penting harus memberi umpan balik (sukses/gagal).\n- Hak akses dibatasi sesuai peran pengguna.\n\n")

	b.WriteString("## 13. Database\n")
	if len(s.Database.Tables) > 0 {
		for _, table := range s.Database.Tables {
			fmt.Fprintf(&b, "### Tabel `%s`\n", table.Name)
			if table.Description != "" {
				fmt.Fprintf(&b, "%s\n", table.Description)
			}
			for _, col := range table.Columns {
				note := col.Note
				if note == "" {
					note = "-"
				}
				fmt.Fprintf(&b, "- `%s` (%s): %s\n", col.Name, col.Type, note)
			}
			b.WriteString("\n")
		}
	} else {
		b.WriteString("- Gunakan SQLite dengan tabel utama sesuai fitur.\n\n")
	}

	b.WriteString("## 14. API\n")
	if len(s.API.Endpoints) > 0 {
		for _, ep := range s.API.Endpoints {
			fmt.Fprintf(&b, "- `%s %s` — %s\n", ep.Method, ep.Path, ep.Description)
		}
	} else {
		b.WriteString("- REST API standar dengan operasi CRUD untuk setiap entitas.\n")
	}
	b.WriteString("\n")

	b.WriteString("## 15. UI Requirements\n")
	b.WriteString("- Responsif di mobile dan desktop.\n- Komponen konsisten.\n- Aksesibilitas dasar (kontras, fokus, label).\n\n")

	b.WriteString("## 16. Security\n")
	b.WriteString("- Validasi dan sanitasi seluruh input.\n- Jangan pernah menaruh kredensial di sisi klien.\n- Batasi akses data sesuai peran pengguna.\n\n")

	b.WriteString("## 17. Testing\n")
	b.WriteString("- Uji alur utama (happy path) dan kasus gagal.\n- Uji validasi form dan batas akses.\n\n")

	b.WriteString("## 18. Definition of Done\n")
	b.WriteString("- Semua fitur utama berjalan tanpa error.\n- Data tersimpan dan tampil dengan benar.\n- Build produksi sukses dan siap dipakai.\n")

	return b.String()
}
