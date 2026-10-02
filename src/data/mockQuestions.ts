import type { Question, QuestionOption } from '@/types';
import { summarizeIdea } from '@/lib/utils';

const isPos = (idea: string) => /(kasir|warung|\bpos\b|toko|retail|transaksi|stok)/i.test(idea);
const isBooking = (idea: string) => /(booking|barber|salon|reservasi|appointment|jadwal)/i.test(idea);

export function featureOptions(idea: string): QuestionOption[] {
  if (isPos(idea)) {
    return [
      { id: 'pos', title: 'Kasir / POS', preselected: true },
      { id: 'products', title: 'Produk', preselected: true },
      { id: 'stock', title: 'Stok', preselected: true },
      { id: 'transactions', title: 'Transaksi', preselected: true },
      { id: 'reports', title: 'Laporan', preselected: true },
      { id: 'customers', title: 'Pelanggan' },
      { id: 'suppliers', title: 'Supplier' },
      { id: 'branches', title: 'Multi cabang' },
      { id: 'staff', title: 'Manajemen karyawan' },
    ];
  }
  if (isBooking(idea)) {
    return [
      { id: 'booking', title: 'Booking / Reservasi', preselected: true },
      { id: 'schedule', title: 'Jadwal & ketersediaan', preselected: true },
      { id: 'staff', title: 'Manajemen karyawan', preselected: true },
      { id: 'services', title: 'Daftar layanan', preselected: true },
      { id: 'reminder', title: 'Pengingat / notifikasi' },
      { id: 'payment', title: 'Pembayaran' },
      { id: 'reports', title: 'Laporan' },
      { id: 'customers', title: 'Pelanggan' },
    ];
  }
  return [
    { id: 'dashboard', title: 'Dashboard', preselected: true },
    { id: 'data', title: 'Kelola data', preselected: true },
    { id: 'reports', title: 'Laporan', preselected: true },
    { id: 'auth', title: 'Akun pengguna', preselected: true },
    { id: 'notifications', title: 'Notifikasi' },
    { id: 'search', title: 'Pencarian & filter' },
    { id: 'export', title: 'Export data' },
    { id: 'payment', title: 'Pembayaran' },
  ];
}

export function buildQuestions(idea: string): Question[] {
  const summary = summarizeIdea(idea);

  const questions: Question[] = [
    {
      id: 'idea_confirmation',
      type: 'confirm',
      label: 'Pertama, pastikan kami memahami ide Anda',
      title: `Anda ingin membuat ${summary}. Benar begitu?`,
      helper: 'Jika ada yang kurang sesuai, Anda dapat memperbaikinya sekarang.',
      placeholder: 'Tuliskan ide Anda dengan lebih jelas...',
      options: [
        { id: 'correct', title: 'Ya, sudah benar' },
        { id: 'fix', title: 'Belum, saya mau perbaiki' },
      ],
      autoAdvance: false,
    },
    {
      id: 'platform',
      type: 'single',
      title: 'Aplikasi ini ingin digunakan di mana?',
      helper: 'Tidak yakin? Pilih "Bantu pilihkan" dan kami akan merekomendasikannya.',
      columns: 2,
      autoAdvance: true,
      options: [
        { id: 'website', title: 'Website', description: 'Bisa dibuka melalui browser di HP dan laptop.', icon: 'Globe' },
        { id: 'mobile', title: 'Aplikasi Seluler', description: 'Aplikasi Android atau iOS.', icon: 'Smartphone' },
        { id: 'desktop', title: 'Aplikasi Desktop', description: 'Aplikasi untuk Windows, macOS, atau Linux.', icon: 'Monitor' },
        { id: 'unsure', title: 'Belum tahu', description: 'Bantu saya menentukan pilihan terbaik.', icon: 'Sparkles' },
      ],
    },
    {
      id: 'website_type',
      type: 'single',
      title: 'Website seperti apa yang ingin Anda buat?',
      showIf: (answers) => answers.platform === 'website' || answers.platform === 'unsure',
      autoAdvance: true,
      options: [
        { id: 'landing', title: 'Laman Landas', description: 'Website sederhana untuk memperkenalkan produk, jasa, atau bisnis.' },
        { id: 'company', title: 'Profil Perusahaan', description: 'Website informasi perusahaan atau organisasi.' },
        { id: 'webapp', title: 'Aplikasi Web', description: 'Website dengan fitur seperti login, dasbor, data, atau transaksi.' },
        { id: 'marketplace', title: 'Lokapasar / Platform', description: 'Website yang mempertemukan banyak pengguna.' },
        { id: 'unsure', title: 'Saya belum tahu', description: 'Bantu tentukan dari ide saya.' },
      ],
    },
    {
      id: 'user_type',
      type: 'multiple',
      title: 'Siapa yang akan menggunakan aplikasi ini?',
      helper: 'Boleh pilih lebih dari satu.',
      allowCustom: true,
      columns: 2,
      options: [
        { id: 'self', title: 'Saya sendiri' },
        { id: 'owner', title: 'Pemilik usaha' },
        { id: 'staff', title: 'Karyawan' },
        { id: 'customer', title: 'Pelanggan' },
        { id: 'admin', title: 'Admin' },
        { id: 'public', title: 'Publik / siapa saja' },
      ],
    },
    {
      id: 'login',
      type: 'single',
      title: 'Apakah pengguna perlu masuk ke akun terlebih dahulu?',
      autoAdvance: true,
      options: [
        { id: 'yes', title: 'Ya', description: 'Pengguna memiliki akun masing-masing.' },
        { id: 'no', title: 'Tidak', description: 'Semua fitur bisa digunakan tanpa login.' },
        { id: 'unsure', title: 'Belum tahu', description: 'Bantu tentukan.' },
      ],
    },
    {
      id: 'data',
      type: 'single',
      title: 'Apakah aplikasi perlu menyimpan data?',
      helper: 'Misalnya data pengguna, produk, transaksi, catatan, booking, atau laporan.',
      autoAdvance: true,
      options: [
        { id: 'yes', title: 'Ya', description: 'Ada data yang perlu disimpan dan diolah.' },
        { id: 'no', title: 'Tidak', description: 'Aplikasi hanya menampilkan informasi.' },
        { id: 'unsure', title: 'Belum tahu', description: 'Bantu tentukan.' },
      ],
    },
    {
      id: 'features',
      type: 'multiple',
      title: 'Fitur apa saja yang menurutmu penting?',
      helper: 'Tenang, nanti kami juga akan merekomendasikan fitur yang mungkin kamu lewatkan.',
      allowCustom: true,
      columns: 2,
      options: featureOptions(idea),
    },
    {
      id: 'design_style',
      type: 'single',
      title: 'Anda ingin tampilannya terasa seperti apa?',
      columns: 2,
      autoAdvance: true,
      options: [
        { id: 'minimal', title: 'Bersih & Minimalis', description: 'Banyak ruang kosong dan sederhana.', visual: 'minimal' },
        { id: 'saas', title: 'SaaS Modern', description: 'Tampilan aplikasi modern dan profesional.', visual: 'saas' },
        { id: 'fun', title: 'Ceria & Bersahabat', description: 'Lebih berwarna dan komunikatif.', visual: 'fun' },
        { id: 'corporate', title: 'Korporat & Profesional', description: 'Formal dan profesional.', visual: 'corporate' },
        { id: 'auto', title: 'Bebaskan AI', description: 'Biarkan sistem menentukan berdasarkan aplikasinya.', visual: 'auto' },
      ],
    },
    {
      id: 'device_priority',
      type: 'single',
      title: 'Aplikasi ini paling sering akan dibuka dari mana?',
      showIf: (answers) => answers.platform === 'website' || answers.platform === 'unsure',
      autoAdvance: true,
      columns: 2,
      options: [
        { id: 'mobile', title: 'HP' },
        { id: 'desktop', title: 'Laptop / komputer' },
        { id: 'both', title: 'Keduanya sama penting' },
        { id: 'unsure', title: 'Belum tahu' },
      ],
    },
    {
      id: 'deployment',
      type: 'single',
      title: 'Apakah Anda sudah tahu aplikasi ini nantinya akan dipasang di mana?',
      helper: 'Jangan khawatir, kami dapat merekomendasikan pilihan yang paling mudah untuk Anda.',
      autoAdvance: true,
      options: [
        { id: 'unsure', title: 'Belum tahu', description: 'Rekomendasikan yang paling mudah.' },
        { id: 'shared', title: 'Shared Hosting / cPanel', description: 'Paket hosting umum, cukup upload.' },
        { id: 'vps', title: 'VPS', description: 'Server sendiri dengan kontrol lebih.' },
        { id: 'vercel', title: 'Vercel / Cloud', description: 'Platform cloud modern.' },
      ],
    },
    {
      id: 'dynamic_stock',
      type: 'single',
      label: 'Pertanyaan berdasarkan ide Anda',
      title: isPos(idea)
        ? 'Apakah stok barang harus otomatis berkurang setiap kali transaksi berhasil?'
        : 'Apakah data perlu diperbarui otomatis saat ada aktivitas baru?',
      contextual: true,
      autoAdvance: true,
      options: [
        { id: 'yes', title: 'Ya' },
        { id: 'no', title: 'Tidak' },
        { id: 'unsure', title: 'Belum tahu' },
      ],
    },
  ];

  return questions;
}
