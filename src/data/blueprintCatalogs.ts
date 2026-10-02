import type { ApiEndpoint, DatabaseSimple, DatabaseTable, PageItem } from '@/types';

export type IdeaKind = 'pos' | 'booking' | 'finance' | 'attendance' | 'landing' | 'generic';

export interface FeatureDetail {
  title: string;
  description: string;
  items: string[];
}

export const FEATURE_DETAILS: Record<string, FeatureDetail> = {
  dashboard: {
    title: 'Dashboard',
    description: 'Ringkasan aktivitas dan angka penting.',
    items: ['Ringkasan hari ini', 'Statistik utama', 'Aktivitas terbaru', 'Grafik ringkas'],
  },
  pos: {
    title: 'Kasir / POS',
    description: 'Proses transaksi dengan cepat.',
    items: [
      'Cari produk',
      'Tambahkan produk ke keranjang',
      'Ubah jumlah item',
      'Hapus item',
      'Hitung total',
      'Pilih metode pembayaran',
      'Simpan transaksi',
      'Cetak struk',
    ],
  },
  products: {
    title: 'Produk',
    description: 'Kelola produk dan harga.',
    items: ['Tambah produk', 'Edit produk', 'Hapus produk', 'Kategori', 'Harga jual', 'Harga modal', 'Stok'],
  },
  stock: {
    title: 'Stok',
    description: 'Pantau jumlah stok.',
    items: ['Stok masuk', 'Stok keluar', 'Peringatan stok menipis', 'Riwayat perubahan stok'],
  },
  transactions: {
    title: 'Transaksi',
    description: 'Riwayat seluruh transaksi.',
    items: ['Daftar transaksi', 'Filter berdasarkan tanggal', 'Detail transaksi', 'Cetak ulang struk'],
  },
  reports: {
    title: 'Laporan',
    description: 'Lihat performa dan ringkasan.',
    items: ['Laporan harian', 'Laporan bulanan', 'Filter periode', 'Export laporan'],
  },
  customers: {
    title: 'Pelanggan',
    description: 'Kelola data pelanggan.',
    items: ['Tambah pelanggan', 'Edit data pelanggan', 'Riwayat pelanggan', 'Pencarian pelanggan'],
  },
  suppliers: {
    title: 'Supplier',
    description: 'Kelola data pemasok.',
    items: ['Tambah supplier', 'Edit supplier', 'Riwayat pembelian', 'Pencarian supplier'],
  },
  branches: {
    title: 'Multi cabang',
    description: 'Kelola beberapa lokasi usaha.',
    items: ['Daftar cabang', 'Data per cabang', 'Pindah cabang aktif', 'Rekap gabungan'],
  },
  staff: {
    title: 'Manajemen karyawan',
    description: 'Kelola akun dan peran karyawan.',
    items: ['Tambah karyawan', 'Atur peran', 'Aktif / nonaktifkan akun', 'Reset kata sandi'],
  },
  booking: {
    title: 'Booking / Reservasi',
    description: 'Pelanggan bisa memesan jadwal.',
    items: ['Pilih layanan', 'Pilih jadwal', 'Konfirmasi booking', 'Batalkan booking', 'Riwayat booking'],
  },
  schedule: {
    title: 'Jadwal & ketersediaan',
    description: 'Atur slot waktu yang tersedia.',
    items: ['Atur jam operasional', 'Blokir slot tertentu', 'Lihat jadwal harian', 'Ketersediaan per karyawan'],
  },
  services: {
    title: 'Layanan',
    description: 'Kelola daftar layanan dan harga.',
    items: ['Tambah layanan', 'Edit layanan', 'Durasi layanan', 'Harga layanan', 'Aktif / nonaktifkan'],
  },
  reminder: {
    title: 'Pengingat / notifikasi',
    description: 'Kirim pengingat otomatis.',
    items: ['Pengingat jadwal', 'Notifikasi status', 'Template pesan', 'Riwayat terkirim'],
  },
  payment: {
    title: 'Pembayaran',
    description: 'Kelola pembayaran dengan mudah.',
    items: ['Catat pembayaran', 'Pilih metode bayar', 'Status pembayaran', 'Riwayat pembayaran'],
  },
  data: {
    title: 'Kelola data',
    description: 'Simpan dan kelola data utama.',
    items: ['Tambah data', 'Edit data', 'Hapus data', 'Pencarian & filter', 'Export data'],
  },
  auth: {
    title: 'Akun pengguna',
    description: 'Pengguna memiliki akun masing-masing.',
    items: ['Registrasi', 'Masuk', 'Keluar', 'Kelola profil'],
  },
  notifications: {
    title: 'Notifikasi',
    description: 'Beritahu pengguna tentang aktivitas penting.',
    items: ['Daftar notifikasi', 'Tandai sudah dibaca', 'Preferensi notifikasi'],
  },
  search: {
    title: 'Pencarian & filter',
    description: 'Temukan data dengan cepat.',
    items: ['Pencarian kata kunci', 'Filter lanjutan', 'Urutkan hasil'],
  },
  export: {
    title: 'Export data',
    description: 'Unduh data untuk keperluan lain.',
    items: ['Export CSV', 'Export Excel', 'Export PDF'],
  },
};

export const FEATURE_PAGES: Record<string, PageItem[]> = {
  dashboard: [{ path: '/dashboard', label: 'Dashboard', group: 'Utama', description: 'Ringkasan aktivitas.' }],
  pos: [{ path: '/pos', label: 'Kasir', group: 'Utama', description: 'Halaman transaksi utama.' }],
  products: [
    { path: '/products', label: 'Produk', group: 'Master Data', description: 'Daftar dan pencarian produk.' },
    { path: '/products/create', label: 'Tambah Produk', group: 'Master Data', description: 'Form produk baru.' },
  ],
  stock: [{ path: '/stock', label: 'Stok', group: 'Master Data', description: 'Pemantauan stok barang.' }],
  transactions: [{ path: '/transactions', label: 'Transaksi', group: 'Laporan', description: 'Riwayat seluruh transaksi.' }],
  reports: [{ path: '/reports', label: 'Laporan', group: 'Laporan', description: 'Laporan performa dan ringkasan.' }],
  customers: [{ path: '/customers', label: 'Pelanggan', group: 'Master Data', description: 'Daftar pelanggan.' }],
  suppliers: [{ path: '/suppliers', label: 'Supplier', group: 'Master Data', description: 'Daftar pemasok.' }],
  branches: [{ path: '/branches', label: 'Cabang', group: 'Master Data', description: 'Daftar cabang usaha.' }],
  staff: [{ path: '/staff', label: 'Karyawan', group: 'Master Data', description: 'Kelola akun karyawan.' }],
  booking: [
    { path: '/booking', label: 'Booking', group: 'Utama', description: 'Daftar dan proses booking.' },
    { path: '/booking/create', label: 'Buat Booking', group: 'Utama', description: 'Form booking baru.' },
  ],
  schedule: [{ path: '/schedule', label: 'Jadwal', group: 'Utama', description: 'Atur ketersediaan jadwal.' }],
  services: [{ path: '/services', label: 'Layanan', group: 'Master Data', description: 'Daftar layanan dan harga.' }],
  reminder: [{ path: '/reminders', label: 'Pengingat', group: 'Laporan', description: 'Pengingat dan notifikasi.' }],
  payment: [{ path: '/payments', label: 'Pembayaran', group: 'Laporan', description: 'Riwayat pembayaran.' }],
  data: [{ path: '/data', label: 'Data', group: 'Master Data', description: 'Kelola data utama.' }],
  auth: [{ path: '/profile', label: 'Profil', group: 'Sistem', description: 'Kelola profil pengguna.' }],
  notifications: [
    { path: '/notifications', label: 'Notifikasi', group: 'Sistem', description: 'Daftar notifikasi pengguna.' },
  ],
};

export const FEATURE_TABLES: Record<string, DatabaseTable[]> = {
  products: [
    {
      name: 'categories',
      description: 'Kategori produk.',
      columns: [
        { name: 'id', type: 'bigint', note: 'primary key' },
        { name: 'name', type: 'varchar(100)' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
    {
      name: 'products',
      description: 'Data produk dan stok.',
      columns: [
        { name: 'id', type: 'bigint', note: 'primary key' },
        { name: 'category_id', type: 'bigint', note: 'foreign key' },
        { name: 'name', type: 'varchar(150)' },
        { name: 'price', type: 'decimal(12,2)' },
        { name: 'cost', type: 'decimal(12,2)' },
        { name: 'stock', type: 'int' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
  ],
  stock: [
    {
      name: 'stock_movements',
      description: 'Riwayat perubahan stok.',
      columns: [
        { name: 'id', type: 'bigint', note: 'primary key' },
        { name: 'product_id', type: 'bigint', note: 'foreign key' },
        { name: 'type', type: 'enum(in, out)' },
        { name: 'qty', type: 'int' },
        { name: 'note', type: 'varchar(255)' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
  ],
  transactions: [
    {
      name: 'transactions',
      description: 'Header transaksi.',
      columns: [
        { name: 'id', type: 'bigint', note: 'primary key' },
        { name: 'user_id', type: 'bigint', note: 'foreign key' },
        { name: 'total', type: 'decimal(12,2)' },
        { name: 'payment_method', type: 'varchar(30)' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
    {
      name: 'transaction_items',
      description: 'Detail item pada satu transaksi.',
      columns: [
        { name: 'id', type: 'bigint', note: 'primary key' },
        { name: 'transaction_id', type: 'bigint', note: 'foreign key' },
        { name: 'product_id', type: 'bigint', note: 'foreign key' },
        { name: 'qty', type: 'int' },
        { name: 'price', type: 'decimal(12,2)' },
        { name: 'subtotal', type: 'decimal(12,2)' },
      ],
    },
  ],
  customers: [
    {
      name: 'customers',
      description: 'Data pelanggan.',
      columns: [
        { name: 'id', type: 'bigint', note: 'primary key' },
        { name: 'name', type: 'varchar(150)' },
        { name: 'phone', type: 'varchar(30)' },
        { name: 'email', type: 'varchar(150)' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
  ],
  suppliers: [
    {
      name: 'suppliers',
      description: 'Data pemasok.',
      columns: [
        { name: 'id', type: 'bigint', note: 'primary key' },
        { name: 'name', type: 'varchar(150)' },
        { name: 'phone', type: 'varchar(30)' },
        { name: 'address', type: 'text' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
  ],
  branches: [
    {
      name: 'branches',
      description: 'Data cabang usaha.',
      columns: [
        { name: 'id', type: 'bigint', note: 'primary key' },
        { name: 'name', type: 'varchar(150)' },
        { name: 'address', type: 'text' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
  ],
  staff: [
    {
      name: 'staff',
      description: 'Data karyawan.',
      columns: [
        { name: 'id', type: 'bigint', note: 'primary key' },
        { name: 'name', type: 'varchar(150)' },
        { name: 'role', type: 'varchar(50)' },
        { name: 'active', type: 'boolean' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
  ],
  booking: [
    {
      name: 'bookings',
      description: 'Data booking pelanggan.',
      columns: [
        { name: 'id', type: 'bigint', note: 'primary key' },
        { name: 'customer_id', type: 'bigint', note: 'foreign key' },
        { name: 'service_id', type: 'bigint', note: 'foreign key' },
        { name: 'staff_id', type: 'bigint', note: 'foreign key' },
        { name: 'scheduled_at', type: 'datetime' },
        { name: 'status', type: 'enum(pending, confirmed, done, cancelled)' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
  ],
  schedule: [
    {
      name: 'schedules',
      description: 'Slot jadwal dan ketersediaan.',
      columns: [
        { name: 'id', type: 'bigint', note: 'primary key' },
        { name: 'staff_id', type: 'bigint', note: 'foreign key' },
        { name: 'day', type: 'varchar(15)' },
        { name: 'start_time', type: 'time' },
        { name: 'end_time', type: 'time' },
        { name: 'available', type: 'boolean' },
      ],
    },
  ],
  services: [
    {
      name: 'services',
      description: 'Daftar layanan.',
      columns: [
        { name: 'id', type: 'bigint', note: 'primary key' },
        { name: 'name', type: 'varchar(150)' },
        { name: 'duration_minutes', type: 'int' },
        { name: 'price', type: 'decimal(12,2)' },
        { name: 'active', type: 'boolean' },
      ],
    },
  ],
  reminder: [
    {
      name: 'reminders',
      description: 'Pengingat terjadwal.',
      columns: [
        { name: 'id', type: 'bigint', note: 'primary key' },
        { name: 'booking_id', type: 'bigint', note: 'foreign key' },
        { name: 'send_at', type: 'datetime' },
        { name: 'status', type: 'enum(pending, sent, failed)' },
      ],
    },
  ],
  payment: [
    {
      name: 'payments',
      description: 'Data pembayaran.',
      columns: [
        { name: 'id', type: 'bigint', note: 'primary key' },
        { name: 'reference_id', type: 'bigint', note: 'foreign key' },
        { name: 'amount', type: 'decimal(12,2)' },
        { name: 'method', type: 'varchar(30)' },
        { name: 'status', type: 'enum(pending, paid, failed)' },
        { name: 'paid_at', type: 'timestamp' },
      ],
    },
  ],
  data: [
    {
      name: 'records',
      description: 'Data utama yang dikelola pengguna.',
      columns: [
        { name: 'id', type: 'bigint', note: 'primary key' },
        { name: 'title', type: 'varchar(150)' },
        { name: 'value', type: 'decimal(12,2)' },
        { name: 'note', type: 'text' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
  ],
  notifications: [
    {
      name: 'notifications',
      description: 'Notifikasi pengguna.',
      columns: [
        { name: 'id', type: 'bigint', note: 'primary key' },
        { name: 'user_id', type: 'bigint', note: 'foreign key' },
        { name: 'title', type: 'varchar(150)' },
        { name: 'read_at', type: 'timestamp' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
  ],
};

export const FEATURE_ENDPOINTS: Record<string, ApiEndpoint[]> = {
  pos: [
    { method: 'GET', path: '/api/products', description: 'Mencari produk untuk keranjang.' },
    { method: 'POST', path: '/api/transactions', description: 'Menyimpan transaksi baru.' },
  ],
  products: [
    { method: 'GET', path: '/api/products', description: 'Daftar produk dengan pencarian dan filter.' },
    { method: 'POST', path: '/api/products', description: 'Menambah produk baru.' },
    { method: 'PUT', path: '/api/products/{id}', description: 'Memperbarui data produk.' },
    { method: 'DELETE', path: '/api/products/{id}', description: 'Menghapus produk.' },
  ],
  stock: [
    { method: 'GET', path: '/api/stock', description: 'Ringkasan stok saat ini.' },
    { method: 'POST', path: '/api/stock/movements', description: 'Mencatat stok masuk atau keluar.' },
  ],
  transactions: [
    { method: 'GET', path: '/api/transactions', description: 'Riwayat transaksi.' },
    { method: 'GET', path: '/api/transactions/{id}', description: 'Detail satu transaksi.' },
  ],
  reports: [{ method: 'GET', path: '/api/reports', description: 'Ringkasan laporan.' }],
  customers: [
    { method: 'GET', path: '/api/customers', description: 'Daftar pelanggan.' },
    { method: 'POST', path: '/api/customers', description: 'Menambah pelanggan.' },
  ],
  suppliers: [
    { method: 'GET', path: '/api/suppliers', description: 'Daftar supplier.' },
    { method: 'POST', path: '/api/suppliers', description: 'Menambah supplier.' },
  ],
  branches: [
    { method: 'GET', path: '/api/branches', description: 'Daftar cabang.' },
    { method: 'POST', path: '/api/branches', description: 'Menambah cabang.' },
  ],
  staff: [
    { method: 'GET', path: '/api/staff', description: 'Daftar karyawan.' },
    { method: 'POST', path: '/api/staff', description: 'Menambah karyawan.' },
  ],
  booking: [
    { method: 'GET', path: '/api/bookings', description: 'Daftar booking.' },
    { method: 'POST', path: '/api/bookings', description: 'Membuat booking baru.' },
    { method: 'PATCH', path: '/api/bookings/{id}', description: 'Mengubah status booking.' },
  ],
  schedule: [
    { method: 'GET', path: '/api/schedules', description: 'Ketersediaan jadwal.' },
    { method: 'POST', path: '/api/schedules', description: 'Mengatur slot jadwal.' },
  ],
  services: [
    { method: 'GET', path: '/api/services', description: 'Daftar layanan.' },
    { method: 'POST', path: '/api/services', description: 'Menambah layanan.' },
  ],
  reminder: [{ method: 'POST', path: '/api/reminders', description: 'Menjadwalkan pengingat.' }],
  payment: [
    { method: 'GET', path: '/api/payments', description: 'Riwayat pembayaran.' },
    { method: 'POST', path: '/api/payments', description: 'Mencatat pembayaran.' },
  ],
  dashboard: [{ method: 'GET', path: '/api/dashboard', description: 'Ringkasan untuk dashboard.' }],
  data: [
    { method: 'GET', path: '/api/data', description: 'Daftar data.' },
    { method: 'POST', path: '/api/data', description: 'Menambah data.' },
  ],
  notifications: [{ method: 'GET', path: '/api/notifications', description: 'Daftar notifikasi pengguna.' }],
  search: [{ method: 'GET', path: '/api/search', description: 'Pencarian lintas data.' }],
  export: [{ method: 'GET', path: '/api/export', description: 'Mengunduh data.' }],
};

export const SIMPLE_DATA: Record<string, DatabaseSimple> = {
  products: { title: 'Data Produk', description: 'Menyimpan nama produk, harga, kategori, dan stok.' },
  stock: { title: 'Data Stok', description: 'Mencatat setiap penambahan dan pengurangan stok.' },
  transactions: { title: 'Data Transaksi', description: 'Menyimpan setiap transaksi beserta itemnya.' },
  customers: { title: 'Data Pelanggan', description: 'Menyimpan informasi pelanggan.' },
  suppliers: { title: 'Data Supplier', description: 'Menyimpan informasi pemasok.' },
  branches: { title: 'Data Cabang', description: 'Menyimpan data tiap cabang usaha.' },
  staff: { title: 'Data Karyawan', description: 'Menyimpan akun dan peran karyawan.' },
  booking: { title: 'Data Booking', description: 'Menyimpan jadwal yang dipesan pelanggan.' },
  schedule: { title: 'Data Jadwal', description: 'Menyimpan ketersediaan dan slot waktu.' },
  services: { title: 'Data Layanan', description: 'Menyimpan daftar layanan dan harga.' },
  reminder: { title: 'Data Pengingat', description: 'Menyimpan pengingat yang akan dikirim.' },
  payment: { title: 'Data Pembayaran', description: 'Menyimpan seluruh pembayaran.' },
  data: { title: 'Data Utama', description: 'Menyimpan data utama yang dikelola pengguna.' },
  notifications: { title: 'Data Notifikasi', description: 'Menyimpan notifikasi untuk pengguna.' },
};

export function userLabel(kind: IdeaKind, id: string): string {
  const staff = kind === 'pos' ? 'Kasir' : kind === 'booking' ? 'Barber' : 'Karyawan';
  const labels: Record<string, string> = {
    self: 'Pemilik',
    owner: 'Pemilik',
    staff,
    customer: 'Pelanggan',
    admin: 'Admin',
    public: 'Pengunjung',
  };
  return labels[id] ?? id;
}

export function defaultFeatureIds(kind: IdeaKind): string[] {
  switch (kind) {
    case 'pos':
      return ['dashboard', 'pos', 'products', 'stock', 'transactions', 'reports'];
    case 'booking':
      return ['dashboard', 'booking', 'schedule', 'services', 'staff'];
    case 'finance':
      return ['dashboard', 'data', 'reports', 'export'];
    case 'attendance':
      return ['dashboard', 'staff', 'data', 'reports'];
    case 'landing':
      return ['dashboard', 'data'];
    default:
      return ['dashboard', 'data', 'reports', 'auth'];
  }
}

export function deploymentLabel(value?: string): string {
  switch (value) {
    case 'shared':
      return 'Shared Hosting / cPanel';
    case 'vps':
      return 'VPS';
    case 'vercel':
      return 'Vercel / Cloud Platform';
    default:
      return 'Rekomendasi AI (Shared Hosting / cPanel)';
  }
}
