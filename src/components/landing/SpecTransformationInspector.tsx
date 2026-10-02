import { ArrowRight, CheckCircle2, Code2, Database, FileText, Sparkles, Terminal } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '@/context/ProjectContext';

interface TransformationSample {
  id: string;
  tabLabel: string;
  badge: string;
  rawIdea: string;
  rawContext: string;
  missingPoints: string[];
  tables: { name: string; desc: string; columns: string }[];
  endpoints: { method: string; path: string; desc: string }[];
  businessRules: string[];
}

const SAMPLES: TransformationSample[] = [
  {
    id: 'kasir',
    tabLabel: 'Kasir Warung',
    badge: 'Next.js 15 + SQLite POS',
    rawIdea:
      '"Saya ingin buat aplikasi kasir sederhana untuk warung kelontong. Kasir bisa catat barang yang dibeli pelanggan dan stok barang bisa berkurang otomatis. Pemilik bisa lihat laporan penjualan tiap malam."',
    rawContext: 'Masukan ide ditulis dalam 2 kalimat bahasa sehari-hari tanpa istilah teknis.',
    missingPoints: [
      'Menambahkan skema harga beli vs harga jual untuk perhitungan laba kotor otomatis.',
      'Menyusun mekanisme validasi stok atomik agar barang tidak bisa minus saat transaksi serentak.',
      'Memisahkan hak akses peran kasir harian dengan laporan keuangan pemilik toko.',
    ],
    tables: [
      { name: 'products', desc: 'Tabel katalog produk & stok', columns: 'id, name, price, cost_price, stock_qty' },
      { name: 'transactions', desc: 'Header struk penjualan', columns: 'id, cashier_id, total, payment_method, created_at' },
      { name: 'transaction_items', desc: 'Detail rincian belanja per struk', columns: 'id, transaction_id, product_id, qty, subtotal' },
      { name: 'stock_movements', desc: 'Audit log pergerakan stok SQLite', columns: 'id, product_id, type(in/out), qty, note' },
    ],
    endpoints: [
      { method: 'POST', path: '/api/pos/transactions', desc: 'Next.js Route Handler transaksi & pengurangan stok atomik' },
      { method: 'GET', path: '/api/products/search', desc: 'Pencarian cepat barcode & nama produk' },
      { method: 'GET', path: '/api/reports/daily-sales', desc: 'Rekapitulasi omzet & laba kotor harian' },
    ],
    businessRules: [
      'Stok wajib divalidasi ketersediaannya sebelum transaksi disimpan ke basis data SQLite.',
      'Harga modal dicatat pada level item transaksi untuk menjaga akurasi laporan laba historis.',
      'Kasir hanya dapat mengakses modul POS; laporan keuangan dikunci khusus peran Pemilik.',
    ],
  },
  {
    id: 'barbershop',
    tabLabel: 'Booking Barbershop',
    badge: 'Next.js 15 + SQLite Reservasi',
    rawIdea:
      '"Mau bikin web buat barbershop supaya langganan bisa pilih jam potong rambut dan pilih kapster favoritnya lewat HP. Biar gak pada antre numpuk di tempat."',
    rawContext: 'Kebutuhan bisnis: membagi kapasitas kursi & mencegah bentrok jadwal.',
    missingPoints: [
      'Menghitung durasi dinamis untuk setiap paket layanan (cukur, cuci, styling).',
      'Menerapkan sistem penguncian slot (hold 10 menit) saat pelanggan memilih jam.',
      'Menyiapkan aturan toleransi pembatalan dan pemberitahuan jadwal otomatis.',
    ],
    tables: [
      { name: 'services', desc: 'Daftar layanan & durasi', columns: 'id, name, duration_minutes, price, is_active' },
      { name: 'barbers', desc: 'Profil kapster & jadwal kerja', columns: 'id, name, avatar_url, schedule_pattern' },
      { name: 'appointments', desc: 'Data reservasi terjadwal', columns: 'id, customer_name, phone, barber_id, start_time, end_time, status' },
    ],
    endpoints: [
      { method: 'GET', path: '/api/schedules/available-slots', desc: 'Kalkulasi slot kosong per kapster secara real-time' },
      { method: 'POST', path: '/api/appointments/reserve', desc: 'Kunci slot jadwal & buat konfirmasi reservasi' },
      { method: 'PATCH', path: '/api/appointments/{id}/cancel', desc: 'Batalkan reservasi & buka kembali ketersediaan slot' },
    ],
    businessRules: [
      'Sistem otomatis memblokir pemesanan ganda (double-booking) pada kapster dan jam yang sama.',
      'Slot waktu yang dipilih dikunci sementara selama 10 menit untuk proses konfirmasi.',
      'Pelanggan menerima kode referensi unik untuk memeriksa status jadwal tanpa harus login rumit.',
    ],
  },
  {
    id: 'keuangan',
    tabLabel: 'Catatan Keuangan',
    badge: 'Next.js 15 + SQLite Buku Besar',
    rawIdea:
      '"Saya ingin aplikasi simpel buat nyatet pemasukan dan pengeluaran harian. Bisa dikelompokkan per kategori, ada grafik pengeluaran bulanan, dan datanya aman tersimpan rapi."',
    rawContext: 'Kebutuhan: pencatatan cepat 5 detik dengan visualisasi anggaran yang jernih.',
    missingPoints: [
      'Mendukung multi-dompet terpisah (kas tunai, rekening bank, e-wallet).',
      'Peringatan otomatis saat pengeluaran mendekati atau melampaui pagu anggaran kategori.',
      'Format ekspor dokumen CSV/Excel untuk rekapitulasi pembukuan berkala.',
    ],
    tables: [
      { name: 'wallets', desc: 'Sumber dana & saldo akun', columns: 'id, name, type, current_balance, currency' },
      { name: 'categories', desc: 'Pos anggaran pemasukan/belanja', columns: 'id, name, type(income/expense), monthly_budget' },
      { name: 'ledger_entries', desc: 'Buku besar transaksi SQLite', columns: 'id, wallet_id, category_id, amount, note, date' },
    ],
    endpoints: [
      { method: 'POST', path: '/api/ledger/quick-entry', desc: 'Catat transaksi kilat & rekonsiliasi saldo dompet' },
      { method: 'GET', path: '/api/analytics/budget-breakdown', desc: 'Statistik persentase realisasi anggaran bulanan' },
      { method: 'GET', path: '/api/export/csv', desc: 'Ekspor mutasi pembukuan format CSV terenkripsi' },
    ],
    businessRules: [
      'Setiap mutasi saldo tercatat berpasangan (double-entry tracking) untuk integritas pembukuan.',
      'Peringatan otomatis dipicu saat pengeluaran kategori mencapai 80% dari pagu bulanan.',
      'Data transaksi sepenuhnya terisolasi per akun pengguna dengan penyimpanan SQLite lokal yang aman.',
    ],
  },
];

export function SpecTransformationInspector() {
  const [activeTab, setActiveTab] = useState<string>('kasir');
  const [specView, setSpecView] = useState<'db' | 'api' | 'rules'>('db');
  const navigate = useNavigate();
  const { createProject } = useProject();

  const current = SAMPLES.find((s) => s.id === activeTab) ?? SAMPLES[0];

  const handleTryPreset = () => {
    const proj = createProject(current.rawIdea);
    navigate(`/project/${proj.id}/interview`);
  };

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-16 text-white">
      {/* Cohesive Section Header */}
      <div className="text-left sm:text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-compact font-semibold text-purple-300 mb-4 tracking-wide">
          <Sparkles size={13} className="text-purple-400" />
          <span>METAMORFOSIS ARSITEKTUR</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-[2.6rem] font-rounded font-bold tracking-tight text-white leading-tight">
          Dari Bahasa Sehari-hari Menjadi PRD Siap Eksekusi
        </h2>
        <p className="mt-3 text-sm sm:text-base font-sans text-purple-200/60 leading-relaxed max-w-2xl mx-auto">
          AI menyaring kebutuhan esensial yang sering terlewatkan, merancang skema SQLite teroptimasi, dan menyusun kontrak REST API siap pakai untuk Next.js.
        </p>

        {/* Preset Selector Tabs */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          {SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => setActiveTab(sample.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-rounded font-semibold transition-all duration-200 ${
                activeTab === sample.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg border border-purple-400/30 scale-[1.02]'
                  : 'border border-purple-500/20 bg-purple-950/30 text-purple-200/60 hover:bg-purple-900/40 hover:text-white hover:border-purple-400/30'
              }`}
            >
              {sample.tabLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Deck (Outer R = 28px) */}
      <div className="rounded-[28px] border border-purple-500/25 bg-[#0F0A20]/80 p-5 sm:p-8 shadow-[0_16px_60px_rgba(109,40,217,0.16)] backdrop-blur-2xl relative overflow-hidden">
        {/* Subtle Ambient Violet Glow inside the deck */}
        <div className="pointer-events-none absolute -top-1/4 -right-1/4 h-80 w-80 rounded-full bg-purple-600/15 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-1/4 -left-1/4 h-80 w-80 rounded-full bg-indigo-600/15 blur-[90px]" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Side (5 Cols): The Raw Human Input (Outer R = 18px) */}
          <div className="lg:col-span-5 rounded-[18px] border border-purple-500/20 bg-[#140C2C]/90 p-5 sm:p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-purple-500/15 pb-3.5 mb-4">
                <span className="text-[11px] font-compact font-semibold uppercase tracking-wider text-purple-300/80 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                  Masukan Bahasa Sehari-hari
                </span>
                <span className="text-[10px] font-mono rounded-md bg-purple-500/15 border border-purple-400/20 px-2 py-0.5 text-purple-200">
                  {current.badge}
                </span>
              </div>

              {/* Chat Bubble Style */}
              <div className="rounded-[14px] border border-purple-500/20 bg-purple-950/30 p-4 text-[13.5px] leading-relaxed text-purple-100 font-sans italic">
                {current.rawIdea}
              </div>

              <p className="mt-3 text-[11px] text-purple-300/50">{current.rawContext}</p>

              {/* Celah Kritis yang Dilengkapi Otomatis */}
              <div className="mt-5 pt-4 border-t border-purple-500/15">
                <p className="text-[11px] font-compact font-semibold uppercase tracking-wider text-purple-300 mb-2.5">
                  Celah Kritis yang Dilengkapi AI:
                </p>
                <ul className="space-y-2">
                  {current.missingPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-purple-100/75 leading-relaxed">
                      <CheckCircle2 size={13} className="text-purple-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-purple-500/15 flex items-center justify-between">
              <span className="text-xs text-purple-200/50">Mulai dari preset ini?</span>
              <button
                type="button"
                onClick={handleTryPreset}
                className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 hover:bg-purple-500 border border-purple-400/30 px-3.5 py-1.5 text-xs font-rounded font-semibold text-white transition-all shadow-md active:scale-95"
              >
                <span>Uji Ide Ini</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Right Side (7 Cols): The Structured Technical Output (Outer R = 18px) */}
          <div className="lg:col-span-7 rounded-[18px] border border-purple-500/20 bg-[#140C2C]/90 p-5 sm:p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/15 pb-3.5 mb-4">
                <span className="text-[11px] font-compact font-semibold uppercase tracking-wider text-purple-300/80 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Spesifikasi Teknis (Next.js + SQLite)
                </span>

                {/* Sub-view switcher */}
                <div className="flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-950/50 p-1">
                  <button
                    type="button"
                    onClick={() => setSpecView('db')}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-compact font-semibold transition ${
                      specView === 'db' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-200/50 hover:text-white'
                    }`}
                  >
                    <Database size={11} />
                    <span>Basis Data (SQLite)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpecView('api')}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-compact font-semibold transition ${
                      specView === 'api' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-200/50 hover:text-white'
                    }`}
                  >
                    <Code2 size={11} />
                    <span>REST API</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpecView('rules')}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-compact font-semibold transition ${
                      specView === 'rules' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-200/50 hover:text-white'
                    }`}
                  >
                    <FileText size={11} />
                    <span>Aturan Bisnis</span>
                  </button>
                </div>
              </div>

              {/* Spec View Content: Dark Code Surface (Inner R = 12px) */}
              <div className="min-h-[260px] rounded-[12px] border border-purple-500/20 bg-[#0A0515] p-4 font-mono text-xs">
                {specView === 'db' && (
                  <div className="space-y-3">
                    <div className="text-[11px] text-purple-300/40 border-b border-purple-500/10 pb-1.5 flex items-center justify-between">
                      <span>// SQLite Schema via Prisma / Drizzle ORM</span>
                      <span className="text-[10px] text-purple-400">Next.js 15 Compatible</span>
                    </div>
                    {current.tables.map((t) => (
                      <div key={t.name} className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-purple-300">{t.name}</span>
                          <span className="text-[10px] text-purple-300/40">// {t.desc}</span>
                        </div>
                        <div className="text-[11px] text-purple-200/60 pl-3">
                          kolom: <span className="text-white/85">{t.columns}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {specView === 'api' && (
                  <div className="space-y-2.5">
                    <div className="text-[11px] text-purple-300/40 border-b border-purple-500/10 pb-1.5 flex items-center justify-between">
                      <span>// Next.js App Router Route Handlers (app/api/...)</span>
                      <span className="text-[10px] text-purple-400">TypeScript</span>
                    </div>
                    {current.endpoints.map((e) => (
                      <div
                        key={e.path}
                        className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-500/10 pb-2 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                              e.method === 'POST'
                                ? 'bg-purple-500/25 text-purple-200 border border-purple-400/30'
                                : e.method === 'GET'
                                  ? 'bg-indigo-500/25 text-indigo-200 border border-indigo-400/30'
                                  : 'bg-violet-500/25 text-violet-200 border border-violet-400/30'
                            }`}
                          >
                            {e.method}
                          </span>
                          <span className="text-white/90 text-[11px]">{e.path}</span>
                        </div>
                        <span className="text-[10px] text-purple-300/40 font-sans">{e.desc}</span>
                      </div>
                    ))}
                  </div>
                )}

                {specView === 'rules' && (
                  <div className="space-y-2.5 font-sans">
                    <div className="text-[11px] text-purple-300/40 border-b border-purple-500/10 pb-1.5 font-mono">
                      // Kriteria Selesai & Aturan Validasi Bisnis
                    </div>
                    {current.businessRules.map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-purple-100/80 text-xs leading-relaxed">
                        <span className="font-mono text-purple-400 font-bold shrink-0">{idx + 1}.</span>
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Prompt Export Stamp */}
            <div className="mt-5 pt-3.5 border-t border-purple-500/15 flex items-center justify-between text-xs text-purple-300/50">
              <span className="flex items-center gap-1.5">
                <Terminal size={13} className="text-purple-400" />
                <span>Format Markdown siap tempel langsung ke Cursor / Claude Code</span>
              </span>
              <span className="text-purple-300 font-mono text-[11px] font-semibold">100% Deterministic</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
