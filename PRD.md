# PROJECT: AI PRODUCT PLANNER & PROMPT GENERATOR — FRONTEND ONLY

Buat sebuah frontend SaaS modern untuk platform **AI Product Planner / AI Prompt Generator** yang ditujukan kepada pengguna awam/non-teknis.

Konsep utama aplikasi:

User cukup memasukkan ide aplikasi menggunakan bahasa sehari-hari. Setelah itu AI akan melakukan interview secara bertahap untuk memahami kebutuhan user, seperti platform yang ingin dibuat, jenis aplikasi, pengguna, fitur utama, login, database, pembayaran, tampilan, deployment, dan kebutuhan lain. Setelah interview selesai, aplikasi nantinya akan menghasilkan Product Blueprint, PRD, Tech Stack, Database Design, API Plan, dan Full Coding Prompt.

Untuk tahap ini, buat **FRONTEND SAJA**. Jangan membuat backend, database server, authentication server, atau integrasi AI sebenarnya.

Semua data sementara boleh menggunakan mock data, React state, dan localStorage.

Frontend harus sudah terasa seperti produk SaaS yang benar-benar siap digunakan.

---

# TECH STACK

Gunakan:

- Vite
- React
- TypeScript
- Tailwind CSS
- React Router
- Lucide React untuk icon
- Framer Motion untuk animasi ringan
- localStorage untuk menyimpan draft project sementara
- Gunakan reusable React components
- Gunakan clean component architecture

Jangan gunakan Next.js.

Jangan membuat backend.

Jangan menggunakan Supabase/Firebase untuk tahap ini.

---

# DESIGN DIRECTION

Desain harus:

- clean
- minimal
- modern
- premium
- spacious
- AI-product feel
- developer-tool inspired tetapi tetap mudah digunakan orang awam
- tidak terlihat seperti admin dashboard template generik

Gunakan inspirasi UX dari:

- Replit untuk halaman input ide / AI builder
- Typeform untuk proses pertanyaan/interview
- Linear untuk detail UI yang clean
- Notion untuk typography dan whitespace

JANGAN menyalin desain persis.

Ambil karakteristik desainnya saja.

---

# VISUAL STYLE

Gunakan base background:

- putih / off-white
- sedikit warm gray

Contoh:

background utama:
`#FAFAF9`

surface:
`#FFFFFF`

border:
`#E7E5E4`

primary text:
`#18181B`

secondary text:
`#71717A`

Gunakan satu accent color modern seperti purple-indigo.

Contoh:

`#6C5CE7`

atau gradient sangat subtle:

`#6D5DFB → #8B5CF6`

Accent jangan terlalu dominan.

Gunakan rounded corner:

- card: 16px–24px
- input: 14px–18px
- button: 12px–16px

Gunakan shadow sangat subtle.

Hindari:

- gradient berlebihan
- glassmorphism berlebihan
- neon
- terlalu banyak card
- dashboard penuh kotak
- sidebar yang terlalu ramai
- icon colorful berlebihan

---

# TYPOGRAPHY

Gunakan typography modern seperti:

- Inter
atau
- Geist

Hierarchy:

Hero heading:
48–64px desktop

Question heading:
36–48px desktop

Section title:
24–32px

Body:
15–18px

Gunakan font weight secukupnya.

Hindari semua heading terlalu bold.

---

# GLOBAL UX PRINCIPLE

Aplikasi harus terasa seperti:

> “Ceritakan apa yang mau kamu buat. Kami akan membantu memikirkan bagian teknisnya.”

User target adalah orang yang mungkin:

- tidak tahu framework
- tidak tahu database
- tidak tahu API
- tidak tahu backend
- bahkan tidak tahu apakah aplikasi mereka harus berupa website atau mobile app

Karena itu gunakan bahasa yang sederhana.

Jangan menampilkan pertanyaan teknis seperti:

> “Pilih database PostgreSQL atau MySQL.”

Tetapi:

> “Apakah aplikasi perlu menyimpan data pengguna?”

Technical decision nantinya ditentukan oleh AI.

---

# APPLICATION ROUTES

Buat route:

```txt
/
 /new
 /project/:projectId/interview
 /project/:projectId/review
 /project/:projectId/result
 /projects
```

Gunakan React Router.

---

# 1. LANDING / IDEA INPUT PAGE

Route:

```txt
/
```

Ini adalah halaman paling penting.

Desain terinspirasi dari pengalaman AI builder seperti Replit.

Halaman harus sangat minimal.

Tidak perlu navbar besar.

Gunakan navbar floating/minimal di bagian atas.

Navbar:

Left:

Logo sederhana.

Gunakan temporary text logo:

**buildprompt**

atau gunakan placeholder brand agar mudah diganti.

Right:

- My Projects
- Sign In

Sign In hanya UI.

---

## HERO

Posisikan content hampir center screen tetapi sedikit lebih tinggi.

Heading:

**Apa yang ingin kamu buat?**

Subheading:

**Ceritakan idemu dengan bahasa sederhana. Kami bantu merancang sisanya.**

Kemudian satu large AI input box.

Ukuran sekitar:

```txt
max-width: 760–850px
```

Input menyerupai AI composer.

Bukan textarea biasa.

Container:

- white
- subtle border
- subtle shadow
- rounded 20–24px

Placeholder:

> Contoh: Saya ingin membuat aplikasi kasir sederhana untuk warung kecil yang bisa mencatat transaksi dan stok.

Textarea auto resize.

Di bagian bawah composer:

Left:

button kecil:

`+ Tambahkan detail`

Optional mock attachment icon.

Right:

button circular / compact:

`↑`

atau:

**Mulai**

Button aktif setelah terdapat input.

---

## IDEA SUGGESTIONS

Di bawah input tampilkan:

**Belum punya ide? Coba salah satu ini**

Gunakan small chips/cards:

- Aplikasi kasir
- Booking barbershop
- Catatan keuangan
- Landing page bisnis
- Sistem absensi

Jika diklik, isi textarea otomatis.

Jangan terlalu besar.

---

## SMALL TRUST MESSAGE

Di bawah:

> Tidak perlu tahu coding, framework, database, atau istilah teknis lainnya.

Dengan icon sparkle kecil.

---

# 2. CREATE PROJECT TRANSITION

Ketika user klik Mulai:

Jangan langsung pindah halaman secara kasar.

Tampilkan transition sederhana:

```txt
Menganalisis idemu...
```

Dengan animation dots / sparkle selama mock 800–1200ms.

Kemudian redirect ke:

```txt
/project/demo-project/interview
```

Simpan original idea ke localStorage.

---

# 3. AI INTERVIEW PAGE

Ini harus memiliki pengalaman seperti Typeform.

Satu layar hanya berisi **SATU pertanyaan utama**.

Jangan membuat form panjang dengan banyak field sekaligus.

Layout desktop:

```txt
----------------------------------------------
logo                 progress             exit

          question number

          Pertanyaan utama

          Helper text bila diperlukan

          [ pilihan jawaban ]

----------------------------------------------
```

Gunakan `max-width: 760px`.

Vertically center content.

---

# INTERVIEW TOP BAR

Atas kiri:

Logo.

Center atau kanan:

progress indicator.

Contoh:

```txt
● ● ● ● ○ ○ ○
```

atau thin progress bar:

```txt
████████░░░░░
```

Dengan text:

`4 dari sekitar 10`

Jangan menjanjikan jumlah pertanyaan pasti karena interview bersifat dinamis.

Gunakan text:

**Langkah 4**

atau:

**40% lengkap**

Top right:

`Simpan & keluar`

---

# QUESTION TRANSITION

Setiap berganti pertanyaan gunakan subtle animation:

- fade
- translateY 8–12px
- duration 200–300ms

Jangan membuat animasi berlebihan.

---

# QUESTION 1 — IDEA CONFIRMATION

Tampilkan:

Small label:

`Pertama, pastikan kami memahami idemu`

Heading:

**Kamu ingin membuat aplikasi kasir sederhana untuk membantu warung mengelola transaksi dan stok. Benar begitu?**

Pilihan:

**Ya, sudah benar**

**Belum, saya mau perbaiki**

Jika perbaiki:

tampilkan textarea.

Button:

**Lanjut**

---

# QUESTION 2 — PLATFORM

Heading:

**Aplikasi ini ingin digunakan di mana?**

Helper:

**Tidak yakin? Pilih “Bantu pilihkan” dan kami akan merekomendasikannya.**

Gunakan large selectable cards.

Options:

### Website
Bisa dibuka melalui browser di HP dan laptop.

Icon:
Globe

### Mobile App
Aplikasi Android atau iPhone.

Icon:
Smartphone

### Desktop
Aplikasi untuk Windows, macOS, atau Linux.

Icon:
Monitor

### Belum tahu
Bantu saya menentukan pilihan terbaik.

Icon:
Sparkles

Saat card hover:

- border menjadi accent
- sedikit naik
- background sangat subtle

Saat selected:

- accent border
- check icon

Keyboard shortcuts optional:

```txt
A
B
C
D
```

agar memiliki feel Typeform.

---

# QUESTION 3 — WEBSITE TYPE

Jika user memilih Website:

Heading:

**Website seperti apa yang ingin kamu buat?**

Options:

### Landing Page
Website sederhana untuk memperkenalkan produk, jasa, atau bisnis.

### Company Profile
Website informasi perusahaan atau organisasi.

### Web Application
Website yang punya fitur seperti login, dashboard, data, atau transaksi.

### Marketplace / Platform
Website yang mempertemukan banyak pengguna.

### Saya belum tahu
Bantu tentukan dari ide saya.

---

# QUESTION 4 — USER TYPE

Heading:

**Siapa yang akan menggunakan aplikasi ini?**

Helper:

**Boleh pilih lebih dari satu.**

Multi select:

- Saya sendiri
- Pemilik usaha
- Karyawan
- Pelanggan
- Admin
- Publik / siapa saja
- Lainnya

Jika Lainnya dipilih munculkan small input.

Button:

**Lanjut**

---

# QUESTION 5 — LOGIN

Heading:

**Apakah pengguna perlu masuk ke akun terlebih dahulu?**

Options:

### Ya
Pengguna memiliki akun masing-masing.

### Tidak
Semua fitur bisa digunakan tanpa login.

### Belum tahu
Bantu tentukan.

---

# QUESTION 6 — DATA

Heading:

**Apakah aplikasi perlu menyimpan data?**

Helper example:

> Misalnya data pengguna, produk, transaksi, catatan, booking, atau laporan.

Options:

- Ya
- Tidak
- Belum tahu

Jangan menyebut database di pertanyaan utama.

---

# QUESTION 7 — FEATURES

Heading:

**Fitur apa saja yang menurutmu penting?**

Gunakan suggested feature chips berdasarkan ide.

Untuk contoh aplikasi kasir:

```txt
✓ Kasir / POS
✓ Produk
✓ Stok
✓ Transaksi
✓ Laporan
□ Pelanggan
□ Supplier
□ Multi cabang
□ Manajemen karyawan
```

Tambah input:

`+ Tambahkan fitur sendiri`

Helper:

> Tenang, nanti kami juga akan merekomendasikan fitur yang mungkin kamu lewatkan.

---

# QUESTION 8 — DESIGN STYLE

Heading:

**Kamu ingin tampilannya terasa seperti apa?**

Gunakan visual style cards.

Options:

### Clean & Minimal
Banyak ruang kosong dan sederhana.

### Modern SaaS
Tampilan aplikasi modern dan profesional.

### Fun & Friendly
Lebih colorful dan playful.

### Corporate
Formal dan profesional.

### Bebaskan AI
Biarkan kami menentukan berdasarkan aplikasinya.

Card bisa memiliki small visual miniature/mock UI.

---

# QUESTION 9 — DEVICE PRIORITY

Untuk website:

Heading:

**Aplikasi ini paling sering akan dibuka dari mana?**

Options:

- HP
- Laptop / komputer
- Keduanya sama penting
- Belum tahu

---

# QUESTION 10 — DEPLOYMENT

Gunakan bahasa awam.

Heading:

**Apakah kamu sudah tahu aplikasi ini nantinya akan dipasang di mana?**

Options:

### Belum tahu
Rekomendasikan yang paling mudah.

### Shared Hosting / cPanel

### VPS

### Vercel / Cloud Platform

Jangan memaksa user mengerti deployment.

---

# DYNAMIC QUESTION DEMO

Setelah beberapa static questions, buat minimal satu pertanyaan yang terlihat seolah dibuat oleh AI berdasarkan context.

Contoh aplikasi kasir:

Label kecil:

`Pertanyaan berdasarkan idemu`

Heading:

**Apakah stok barang harus otomatis berkurang setiap kali transaksi berhasil?**

Options:

- Ya
- Tidak
- Belum tahu

Tambahkan sparkle icon kecil agar user memahami ini pertanyaan contextual.

---

# TYPEFORM-LIKE INTERACTION

Implementasikan:

- satu pertanyaan per screen
- tekan Enter untuk lanjut
- angka/huruf shortcut untuk pilihan
- smooth transition
- progress otomatis
- auto focus
- selected answer jelas
- previous button dengan arrow
- keyboard navigation

Bottom:

```txt
← Sebelumnya                       Tekan Enter ↵
```

Pada mobile gunakan fixed bottom action bar.

---

# 4. REQUIREMENT PROCESSING SCREEN

Setelah interview selesai tampilkan processing screen.

Center:

animated subtle orb / sparkle.

Text berubah secara sequential:

```txt
Memahami kebutuhan aplikasimu...
```

kemudian:

```txt
Menyusun fitur utama...
```

kemudian:

```txt
Menentukan struktur aplikasi...
```

kemudian:

```txt
Menyiapkan blueprint...
```

Gunakan mock delay singkat.

Jangan terlalu lama.

Setelah selesai redirect:

```txt
/project/demo-project/review
```

---

# 5. REVIEW / PROJECT BLUEPRINT PAGE

Berbeda dari interview.

Sekarang tampilkan workspace.

Layout:

```txt
sidebar | main content
```

Sidebar tipis sekitar 240px.

Sidebar:

Logo

Project:
**Kasir Warung**

Navigation:

- Overview
- Features
- Pages
- Tech Stack
- Database
- API
- PRD
- Build Prompt

Bottom:

- Settings
- Back to Projects

Untuk frontend-only, seluruh data berupa mock.

---

# OVERVIEW HEADER

Breadcrumb:

`Projects / Kasir Warung`

Title:

**Kasir Warung**

Badge:

`Web Application`

Description:

> Aplikasi kasir berbasis web untuk membantu warung mengelola transaksi, produk, stok, dan laporan sederhana.

Buttons:

`Edit Requirement`

Primary:

**Generate Project**

---

# PROJECT COMPLETENESS

Card tipis:

```txt
Project Blueprint

92% siap dibuat
█████████████████░
```

Small text:

> Kami sudah memiliki informasi yang cukup untuk membuat spesifikasi aplikasi.

---

# PRODUCT SUMMARY

Section:

**Ringkasan**

Show clean text content.

---

# FEATURES

Section:

**Fitur utama**

Grid/list:

### Dashboard
Ringkasan penjualan dan aktivitas.

### Kasir / POS
Proses transaksi dengan cepat.

### Produk
Kelola produk dan harga.

### Stok
Pantau jumlah stok.

### Transaksi
Riwayat seluruh transaksi.

### Laporan
Lihat penjualan dan keuntungan.

Button:

`+ Tambahkan fitur`

---

# USER ROLES

Section:

**Pengguna**

Chips:

```txt
Owner
Kasir
```

---

# PROJECT STRUCTURE PREVIEW

Tampilkan preview:

```txt
Dashboard
Kasir
Produk
Stok
Transaksi
Laporan
Pengaturan
```

Jangan terlalu teknis.

---

# TECH STACK PREVIEW

Meskipun frontend saja, buat mock hasil rekomendasi.

Card:

**Rekomendasi teknologi**

Frontend:
React + Vite

Backend:
Laravel

Database:
MySQL

Hosting:
cPanel / Shared Hosting

Tambahkan badge:

`Direkomendasikan AI`

Tooltip:

> Pilihan ini dibuat berdasarkan kebutuhan dan cara aplikasi akan digunakan.

---

# USER CAN EDIT REQUIREMENTS

Klik:

**Edit Requirement**

buka right side drawer.

Drawer berisi:

- platform
- users
- login
- save data
- device
- deployment
- features

Gunakan user-friendly terminology.

---

# 6. GENERATION RESULT PAGE

Route:

```txt
/project/:projectId/result
```

Setelah klik:

**Generate Project**

Tampilkan generation animation.

Kemudian masuk halaman hasil.

---

# RESULT PAGE LAYOUT

Sidebar tetap.

Main content heading:

**Project kamu siap 🚀**

Subheading:

> Kami sudah mengubah idemu menjadi spesifikasi lengkap yang siap diberikan ke AI coding.

Top actions:

```txt
Copy Build Prompt
Download .md
```

Download boleh berupa mock interaction.

---

# RESULT TABS

Gunakan horizontal tab:

```txt
Overview
Features
Pages
Database
API
PRD
Build Prompt
```

---

# OVERVIEW TAB

Show:

Product summary

Platform

Users

Main features

Recommended stack

Deployment recommendation

---

# FEATURES TAB

Breakdown detail.

Contoh:

### Kasir / POS

- Cari produk
- Tambahkan produk ke keranjang
- Ubah jumlah item
- Hapus item
- Hitung total
- Pilih metode pembayaran
- Simpan transaksi
- Cetak struk

### Produk

- Tambah produk
- Edit produk
- Hapus produk
- Kategori
- Harga jual
- Harga modal
- Stok

Gunakan accordion.

---

# PAGES TAB

Show app pages.

Example:

```txt
/login

/dashboard

/pos

/products

/products/create

/transactions

/reports

/settings
```

Gunakan tree/list design.

---

# DATABASE TAB

Karena target user awam, beri dua mode:

Toggle:

```txt
Simple
Technical
```

Simple:

### Data Pengguna

Menyimpan akun owner dan kasir.

### Data Produk

Menyimpan nama produk, harga, kategori dan stok.

### Data Transaksi

Menyimpan setiap transaksi penjualan.

Technical:

show mock schema:

```txt
users
products
categories
transactions
transaction_items
```

Gunakan clean ERD-like cards tetapi tidak perlu library diagram berat.

---

# API TAB

Sama:

Toggle:

```txt
Simple
Technical
```

Simple explanation.

Technical tampilkan endpoint seperti:

```txt
POST /api/auth/login

GET /api/products

POST /api/products

POST /api/transactions

GET /api/reports
```

---

# PRD TAB

Tampilkan document-style page.

Structure:

```txt
Product Overview

Problem

Target Users

Goals

Core Features

User Roles

User Flow

Pages

Business Rules

Technical Requirements

Security

Deployment

Definition of Done
```

Gunakan layout seperti document editor.

Button:

```txt
Copy PRD
Download
```

---

# BUILD PROMPT TAB

Ini harus menjadi salah satu bagian paling menarik.

Header:

**Full Build Prompt**

Description:

> Prompt lengkap yang bisa kamu berikan ke AI coding favoritmu.

Dropdown:

```txt
Generic
Claude Code
Codex
Cursor
Lovable
Replit
```

Tidak perlu benar-benar menghasilkan versi berbeda. Gunakan mock data.

Prompt ditampilkan seperti code/document viewer.

Contoh structure:

```txt
# ROLE

You are a senior full-stack software engineer...

# PROJECT OBJECTIVE

Build a web-based POS application...

# TECH STACK

...

# APPLICATION FEATURES

...

# PAGES

...

# DATABASE

...

# API

...

# BUSINESS RULES

...

# UI REQUIREMENTS

...

# SECURITY

...

# TESTING

...

# DEFINITION OF DONE
```

Top right:

**Copy Prompt**

Setelah diklik:

icon check + text:

**Copied**

---

# STEP-BY-STEP PROMPTS

Di bawah Full Build Prompt:

Heading:

**Atau bangun secara bertahap**

Cards:

```txt
01
Project Setup

02
Authentication

03
Database

04
Dashboard

05
Main Features

06
Testing

07
Deployment
```

Klik card membuka modal berisi prompt contoh.

---

# 7. PROJECTS PAGE

Route:

```txt
/projects
```

Simple workspace.

Header:

**Projects**

Button:

`+ New Project`

Grid/list cards.

Example:

### Kasir Warung

Web Application

Updated just now

`92% Complete`

---

### Booking Barbershop

Web Application

Updated yesterday

`100% Complete`

---

Card menu:

```txt
Rename
Duplicate
Delete
```

Mock only.

---

# EMPTY STATE

Jika tidak ada project:

Illustration sederhana.

Text:

**Belum ada project**

> Mulai dari satu ide sederhana. Kami bantu merancang sisanya.

Button:

**Buat project pertama**

---

# 8. MOBILE RESPONSIVE

Wajib responsive.

Landing page harus bagus di HP.

Interview harus sangat nyaman di mobile.

Pada mobile:

- question font sekitar 28–34px
- option card full width
- top bar compact
- bottom navigation sticky

Workspace sidebar berubah menjadi drawer.

Result page tabs horizontal scroll.

---

# 9. COMPONENT ARCHITECTURE

Gunakan struktur seperti:

```txt
src/
  components/
    layout/
    ui/
    interview/
    project/
    result/

  pages/
    HomePage
    InterviewPage
    ReviewPage
    ResultPage
    ProjectsPage

  data/
    mockQuestions
    mockProject
    mockResult

  hooks/

  lib/

  types/
```

---

# 10. REUSABLE COMPONENTS

Minimal buat:

```txt
AppLogo

AIComposer

SuggestionChip

QuestionLayout

QuestionProgress

ChoiceCard

MultiChoice

TextQuestion

InterviewNavigation

LoadingSequence

ProjectSidebar

ProjectHeader

FeatureCard

RequirementDrawer

ResultTabs

DocumentViewer

PromptViewer

EmptyState
```

---

# 11. MOCK DATA STRUCTURE

Interview question sebaiknya data driven.

Example:

```ts
type Question = {
  id: string
  type:
    | "single"
    | "multiple"
    | "text"

  title: string
  description?: string

  options?: {
    id: string
    title: string
    description?: string
    icon?: string
  }[]

  contextual?: boolean
}
```

Jangan hardcode seluruh UI berdasarkan page.

Render question berdasarkan object.

Ini penting karena nantinya pertanyaan akan berasal dari AI backend.

---

# 12. PROJECT STATE

Buat global project state sederhana menggunakan:

React Context

atau lightweight state approach tanpa dependency besar.

State minimal:

```ts
{
  idea: string,
  currentStep: number,
  answers: {},
  project: {},
  result: {}
}
```

Persist ke localStorage.

Jika browser direfresh, progress interview tetap ada.

---

# 13. MICRO INTERACTIONS

Tambahkan:

- subtle hover
- selected card animation
- smooth question transition
- button loading state
- copy success
- toast
- progress animation
- textarea auto resize
- auto focus

Gunakan Framer Motion secukupnya.

Jangan membuat UI terasa ramai.

---

# 14. ACCESSIBILITY

Pastikan:

- proper label
- keyboard navigation
- visible focus state
- semantic buttons
- sufficient contrast
- Enter untuk lanjut
- Esc untuk close modal/drawer
- usable tanpa mouse

---

# 15. IMPORTANT DESIGN RULES

DO:

- gunakan whitespace besar
- buat UI tenang
- prioritaskan satu action utama
- gunakan typography sebagai elemen desain
- gunakan border tipis
- gunakan icon sederhana
- gunakan progressive disclosure
- buat interview terasa seperti conversation

DON'T:

- membuat dashboard template generik
- terlalu banyak card
- sidebar dengan puluhan menu
- menggunakan gradient berlebihan
- menggunakan warna terlalu banyak
- menggunakan glass effect berlebihan
- menggunakan tabel untuk semua hal
- memberikan terlalu banyak informasi dalam satu screen
- membuat interview seperti Google Form

---

# 16. UX DETAIL — TYPEFORM FEEL

Experience interview sangat penting.

User harus merasa seperti sedang berbicara dengan Product Manager.

Contoh sequence:

```txt
Apa yang ingin kamu buat?
        ↓
Website atau aplikasi?
        ↓
Siapa yang akan menggunakannya?
        ↓
Perlu akun?
        ↓
Data apa yang disimpan?
        ↓
Fitur apa yang dibutuhkan?
        ↓
Ada kebutuhan khusus?
        ↓
Selesai.
```

Jangan memperlihatkan 10 pertanyaan sekaligus.

Satu pertanyaan.

Satu keputusan.

Lanjut.

---

# 17. UX DETAIL — REPLIT-LIKE START EXPERIENCE

Landing page jangan terlihat seperti landing page marketing tradisional.

Jangan memenuhi halaman dengan:

- pricing
- testimonial
- feature section
- logo perusahaan
- footer besar

Fokus utama halaman pertama hanya:

```txt
logo

Apa yang ingin kamu buat?

[                  IDEA INPUT                    ]

suggestion ideas
```

Biarkan produk langsung digunakan.

Marketing bisa ditambahkan nanti.

---

# 18. SAMPLE DEFAULT IDEA

Untuk demo gunakan:

```txt
Saya ingin membuat aplikasi kasir sederhana untuk warung kecil. Pemilik bisa mengelola produk dan stok, kasir bisa melakukan transaksi, dan pemilik bisa melihat laporan penjualan.
```

Mock interview dan mock results menyesuaikan ide tersebut.

---

# 19. FAKE AI EXPERIENCE

Karena belum ada backend AI, buat UX seolah AI bekerja.

Gunakan artificial delay kecil:

```txt
Analyzing idea...
Generating follow-up question...
Preparing product blueprint...
Generating build prompt...
```

Tetapi jangan lebih dari sekitar 1 detik untuk setiap transition.

Gunakan skeleton / subtle animation.

---

# 20. FUTURE BACKEND READY

Walaupun sekarang frontend-only, struktur aplikasi harus mudah disambungkan dengan API di kemudian hari.

Pisahkan mock service:

```txt
services/
  projectService.ts
  interviewService.ts
  generationService.ts
```

Sekarang service mengembalikan Promise + mock data.

Contoh:

```ts
analyzeIdea(idea)

getNextQuestion(projectId, answers)

generateBlueprint(projectId)

generateProjectResult(projectId)
```

Jangan menghubungkan ke AI sungguhan.

---

# 21. FINAL EXPECTATION

Ketika aplikasi dijalankan dengan:

```bash
npm install
npm run dev
```

semua halaman harus berfungsi.

Flow berikut HARUS dapat dicoba sampai selesai:

```txt
Landing
↓
Masukkan ide
↓
Mulai
↓
Interview satu per satu
↓
Jawab seluruh pertanyaan
↓
Processing
↓
Review Blueprint
↓
Generate Project
↓
Result
↓
Lihat PRD
↓
Lihat database
↓
Lihat API
↓
Lihat full build prompt
↓
Copy prompt
```

Semua tombol penting harus berfungsi.

Tidak boleh ada button utama yang hanya decorative.

Gunakan mock/local state jika functionality sebenarnya belum tersedia.

---

# 22. QUALITY REQUIREMENT

Prioritaskan kualitas frontend.

Pastikan:

- spacing konsisten
- typography bagus
- responsive
- transition halus
- tidak ada horizontal overflow
- tidak ada broken route
- tidak ada dead button
- code reusable
- TypeScript tidak memiliki error
- console tidak memiliki error
- mobile layout proper
- loading/empty/error state tersedia
- visual terasa seperti SaaS premium, bukan template admin

---

# FINAL DESIGN GOAL

Produk harus terasa seperti gabungan:

**Replit-style AI starting experience**
+
**Typeform-style guided interview**
+
**Linear-style clean SaaS workspace**

Tetapi memiliki identitas sendiri.

Keseluruhan pengalaman harus membuat pengguna awam merasa:

> “Aku cukup menjelaskan ide. Sistem ini yang memikirkan bagian teknisnya.”

Fokus tahap ini hanya membangun **frontend experience yang matang, polished, dan siap disambungkan ke AI backend pada tahap berikutnya.**