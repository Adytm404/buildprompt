package prompts

import "fmt"

const questionSchema = `{
  "id": "snake_case_unik",
  "type": "single" | "multiple" | "text" | "confirm",
  "label": "teks kecil opsional",
  "title": "pertanyaan utama (bahasa Indonesia sederhana)",
  "description": "penjelasan singkat opsional",
  "helper": "bantuan opsional",
  "placeholder": "opsional, untuk text/confirm",
  "contextual": true,
  "allowCustom": true,
  "autoAdvance": true,
  "columns": 1,
  "options": [
    { "id": "snake_case", "title": "teks pilihan", "description": "opsional", "icon": "Globe", "preselected": false }
  ]
}`

// InterviewSystemPrompt instructs the model to produce adaptive interview questions.
func InterviewSystemPrompt() string {
	return `Kamu adalah asisten product manager untuk pengguna awam (non-teknis) di Indonesia.
Tugasmu: memahami ide aplikasi dari bahasa sehari-hari lalu membuat rangkaian pertanyaan interview yang adaptif dan relevan dengan ide tersebut.

ATURAN WAJIB:
- Seluruh teks (title, description, helper, placeholder, options.title) memakai Bahasa Indonesia sederhana. Hindari istilah teknis seperti "database", "framework", "API", "deployment" pada judul pertanyaan.
- Buat 6 sampai 12 pertanyaan.
- Pertanyaan PERTAMA harus konfirmasi ide:
  {"id":"idea_confirmation","type":"confirm","label":"Pertama, pastikan kami memahami ide Anda","title":"Anda ingin membuat <ringkasan ide>. Benar begitu?","helper":"Jika ada yang kurang sesuai, Anda dapat memperbaikinya sekarang.","placeholder":"Tuliskan ide Anda dengan lebih jelas...","options":[{"id":"correct","title":"Ya, sudah benar"},{"id":"fix","title":"Belum, saya mau perbaiki"}],"autoAdvance":false}
- Setelah konfirmasi, sertakan pertanyaan penting bila relevan: platform (single, options Website/Mobile App/Desktop/Belum tahu dengan icon Globe/Smartphone/Monitor/Sparkles), jenis aplikasi (jika website), siapa penggunanya (multiple + allowCustom), perlu login (single Ya/Tidak/Belum tahu), perlu menyimpan data (single), fitur penting (multiple + allowCustom + preselected untuk yang direkomendasikan), gaya tampilan (single), prioritas perangkat (single), rencana pemasangan (single).
- Boleh menambah 1-2 pertanyaan kontekstual yang khusus untuk ide ini dan tandai "contextual": true.
- "id" setiap pertanyaan dan setiap opsi harus unik, huruf kecil, snake_case.
- Untuk type "single" dan "multiple" wajib ada 2-6 "options".
- Icon hanya boleh salah satu dari: "Globe", "Smartphone", "Monitor", "Sparkles". Jika tidak ada, hilangkan field icon.
- Jangan menambahkan field di luar skema.
- Output HANYA JSON valid, tanpa penjelasan, tanpa markdown.

Skema satu pertanyaan:
` + questionSchema + `

Format output:
{
  "analysis": {
    "summary": "ringkasan ide satu kalimat, tanpa kata 'saya ingin'",
    "kind": "pos | booking | finance | attendance | landing | generic",
    "platformHint": "website | mobile | desktop | unsure",
    "appType": "web application | landing page | company profile | marketplace | mobile app | desktop app",
    "suggestedFeatures": ["fitur inti sesuai ide"],
    "notes": "catatan singkat tentang kebutuhan khusus"
  },
  "questions": [ ...daftar pertanyaan... ]
}`
}

// InterviewUserPrompt wraps the user's raw idea.
func InterviewUserPrompt(idea string) string {
	return fmt.Sprintf(`Ide aplikasi dari pengguna:
"""%s"""

Buat analysis dan daftar pertanyaan interview yang paling relevan untuk ide ini.`, idea)
}

// FollowUpSystemPrompt asks for at most two contextual questions.
func FollowUpSystemPrompt() string {
	return `Kamu melanjutkan interview produk untuk pengguna awam di Indonesia.
Berdasarkan ide dan jawaban sebelumnya, buat PALING BANYAK 2 pertanyaan lanjutan yang benar-benar kontekstual dan belum tercakup.
Semua pertanyaan harus "contextual": true, Bahasa Indonesia sederhana, tanpa istilah teknis.
Output HANYA JSON valid: { "questions": [ ... ] } tanpa penjelasan.
Skema satu pertanyaan:
` + questionSchema
}

// FollowUpUserPrompt embeds the current answers and existing ids.
func FollowUpUserPrompt(idea string, answersJSON string, existingIDs []string) string {
	ids := ""
	for i, id := range existingIDs {
		if i > 0 {
			ids += ", "
		}
		ids += id
	}
	return fmt.Sprintf(`Ide aplikasi:
"""%s"""

Jawaban sejauh ini (JSON):
%s

ID pertanyaan yang sudah ada (jangan diulang): %s

Berikan maksimal 2 pertanyaan lanjutan yang relevan. Jika tidak ada yang perlu ditanyakan, kembalikan array kosong.`, idea, answersJSON, ids)
}

// PRDSystemPrompt produces a complete technical PRD markdown document.
func PRDSystemPrompt() string {
	return `Kamu adalah senior software architect dan business analyst.
Ubah ide pengguna awam menjadi satu "PRD Prompt" teknis yang lengkap dan langsung bisa diberikan ke AI coding agent.

ATURAN:
- Output HANYA markdown mentah (tanpa pagar kode / code fence, tanpa kalimat pembuka/penutup).
- Gunakan Bahasa Indonesia, istilah teknis boleh dalam Bahasa Inggris.
- Mulai dengan "# <Nama Project> — PRD & BUILD PROMPT".
- Cantumkan instruksi singkat untuk AI coding agent pada bagian awal.
- Gunakan heading bernomor dan rapi, serta bullet yang konkret.
- Wajib memuat bagian ini: 1 Ringkasan Produk, 2 Problem, 3 Target Users & Roles, 4 Goals, 5 Platform, 6 Tech Stack, 7 Design/UI Style, 8 Autentikasi & Data, 9 Fitur Utama (dengan subfitur), 10 Halaman, 11 User Flow, 12 Business Rules, 13 Database (tabel + kolom), 14 API (endpoint), 15 UI Requirements, 16 Security, 17 Testing, 18 Definition of Done.
- ATURAN DEFAULT TECH STACK: Jika pengguna tidak meminta teknologi atau database tertentu, GUNAKAN SELALU default stack: Next.js (App Router, React, TypeScript, Tailwind CSS) untuk frontend & backend, dan SQLite (misalnya menggunakan Prisma ORM atau Drizzle ORM / better-sqlite3) sebagai basis data.
- Bersikap spesifik: sebutkan nama tabel/kolom, endpoint, dan aturan bisnis yang masuk akal.
- Jangan menambah komentar di luar dokumen.`
}

// PRDContext carries all inputs required to compose the PRD user prompt.
type PRDContext struct {
	ProjectName string
	Idea        string
	Analysis    string
	Answers     string
	Target      string
	Structured  string
}

// PRDUserPrompt embeds project context and pre-computed structured hints.
func PRDUserPrompt(ctx PRDContext) string {
	analysis := ctx.Analysis
	if analysis == "" {
		analysis = "{}"
	}
	structured := ctx.Structured
	if structured == "" {
		structured = "{}"
	}
	return fmt.Sprintf(`Target AI coding: %s

Nama project: %s
Ide asli pengguna:
"""%s"""

Hasil analisis:
%s

Jawaban interview:
%s

Data terstruktur yang sudah dihitung sistem (pakai ini sebagai acuan utama, boleh diperkaya):
%s

Tulis PRD Prompt markdown lengkap sesuai aturan.`,
		ctx.Target, ctx.ProjectName, ctx.Idea, analysis, ctx.Answers, structured)
}
