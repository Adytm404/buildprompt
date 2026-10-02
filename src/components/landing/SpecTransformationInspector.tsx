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
    badge: 'Aplikasi Web & POS',
    rawIdea:
      '"Saya ingin buat aplikasi kasir sederhana untuk warung kelontong. Kasir bisa catat barang yang dibeli pelanggan dan stok barang bisa berkurang otomatis. Pemilik bisa lihat laporan penjualan tiap malam."',
    rawContext: 'Ide ditulis dalam 2 kalimat bahasa sehari-hari tanpa istilah teknis.',
    missingPoints: [
      'Belum ada skema harga beli vs harga jual untuk hitung laba kotor.',
      'Belum ada mitigasi jika barang habis saat transaksi berlangsung.',
      'Perlu pemisahan hak akses antara kasir harian dan pemilik toko.',
    ],
    tables: [
      { name: 'products', desc: 'Katalog barang & harga', columns: 'id, name, price, cost_price, stock_qty' },
      { name: 'transactions', desc: 'Header struk penjualan', columns: 'id, cashier_id, total, payment_method, created_at' },
      { name: 'transaction_items', desc: 'Rincian barang per transaksi', columns: 'id, transaction_id, product_id, qty, subtotal' },
      { name: 'stock_movements', desc: 'Audit log pergerakan stok', columns: 'id, product_id, type(in/out), qty, note' },
    ],
    endpoints: [
      { method: 'POST', path: '/api/pos/transactions', desc: 'Simpan transaksi & kurangi stok atomik' },
      { method: 'GET', path: '/api/products/search', desc: 'Pencarian cepat barcode / nama produk' },
      { method: 'GET', path: '/api/reports/daily-sales', desc: 'Rekapitulasi omzet & laba kotor harian' },
    ],
    businessRules: [
      'Stok wajib divalidasi ketersediaannya sebelum transaksi disimpan (anti-minus).',
      'Harga modal dicatat pada level item transaksi untuk menjaga akurasi laporan laba historis.',
      'Kasir hanya dapat mengakses modul POS; laporan keuangan dikunci khusus peran Pemilik.',
    ],
  },
  {
    id: 'barbershop',
    tabLabel: 'Booking Barbershop',
    badge: 'Aplikasi Reservasi & Jadwal',
    rawIdea:
      '"Mau bikin web buat barbershop supaya langganan bisa pilih jam potong rambut dan pilih kapster favoritnya lewat HP. Biar gak pada antre numpuk di tempat."',
    rawContext: 'Kebutuhan bisnis riil: membagi kapasitas kursi & mencegah double-booking.',
    missingPoints: [
      'Belum ditentukan durasi layanan (tiap paket potong/cukur butuh waktu berbeda).',
      'Perlu mekanisme penguncian slot sementara (lock 10 menit) saat pelanggan memilih jam.',
      'Perlu penanganan pembatalan dan batas waktu maksimal perubahan jadwal.',
    ],
    tables: [
      { name: 'services', desc: 'Daftar paket & durasi', columns: 'id, name, duration_minutes, price, is_active' },
      { name: 'barbers', desc: 'Profil kapster & spesialisasi', columns: 'id, name, avatar_url, schedule_pattern' },
      { name: 'appointments', desc: 'Data reservasi terjadwal', columns: 'id, customer_name, phone, barber_id, start_time, end_time, status' },
    ],
    endpoints: [
      { method: 'GET', path: '/api/schedules/available-slots', desc: 'Kalkulasi slot kosong per kapster & durasi' },
      { method: 'POST', path: '/api/appointments/reserve', desc: 'Kunci slot jadwal & kirim notifikasi konfirmasi' },
      { method: 'PATCH', path: '/api/appointments/{id}/cancel', desc: 'Batalkan reservasi & buka kembali slot waktu' },
    ],
    businessRules: [
      'Sistem otomatis memblokir pemesanan ganda (double-booking) pada kapster dan jam yang sama.',
      'Jadwal yang dipilih diberi toleransi kunci (hold) selama 10 menit sebelum dilepas jika tidak dikonfirmasi.',
      'Pelanggan menerima kode unik untuk memeriksa status reservasi tanpa harus mendaftar akun rumit.',
    ],
  },
  {
    id: 'keuangan',
    tabLabel: 'Catatan Keuangan',
    badge: 'Aplikasi Finansial Mandiri',
    rawIdea:
      '"Saya ingin aplikasi simpel buat nyatet pemasukan dan pengeluaran harian. Bisa dikelompokkan per kategori, ada grafik pengeluaran bulanan, dan datanya aman tersimpan rapi."',
    rawContext: 'Kebutuhan: pencatatan cepat 5 detik dengan visualisasi anggaran yang jernih.',
    missingPoints: [
      'Perlu penanganan multi-dompet (kas tunai, rekening bank, dompet digital).',
      'Peringatan otomatis saat pengeluaran melampaui batas anggaran kategori tertentu.',
      'Format ekspor dokumen (CSV/PDF) untuk keperluan audit pajak pribadi atau usaha.',
    ],
    tables: [
      { name: 'wallets', desc: 'Sumber dana (rekening/kas)', columns: 'id, name, type, current_balance, currency' },
      { name: 'categories', desc: 'Kategori pos belanja', columns: 'id, name, type(income/expense), monthly_budget' },
      { name: 'ledger_entries', desc: 'Buku besar transaksi', columns: 'id, wallet_id, category_id, amount, note, date' },
    ],
    endpoints: [
      { method: 'POST', path: '/api/ledger/quick-entry', desc: 'Catat transaksi kilat & perbarui saldo dompet' },
      { method: 'GET', path: '/api/analytics/budget-breakdown', desc: 'Rekap persentase pengeluaran vs pagu anggaran' },
      { method: 'GET', path: '/api/export/financial-summary', desc: 'Unduh laporan rekapitulasi format CSV/Excel' },
    ],
    businessRules: [
      'Setiap mutasi saldo tercatat berpasangan (double-entry tracking) untuk menghindari ketidakcocokan nilai.',
      'Sistem memicu indikator peringatan saat akumulasi kategori mencapai 80% dari pagu anggaran bulanan.',
      'Data transaksi sepenuhnya terisolasi per akun pengguna dengan enkripsi pada nilai saldo sensitif.',
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
    <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-20 text-white">
      {/* Section Header */}
      <div className="text-left sm:text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-3.5 py-1 text-xs font-semibold text-pink-300 mb-3 tracking-wide">
          <Sparkles size={13} />
          <span>BUKTI TRANSFORMASI ARSITEKTUR</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
          Lihat Bagaimana Ide Mentah Diubah Menjadi Spesifikasi Nyata
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-white/50 leading-relaxed">
          Bukan sekadar teks pemanis. AI memetakan celah bisnis yang Anda lewatkan, merancang skema relasi basis data, dan menyusun kontrak REST API siap pakai.
        </p>

        {/* Preset Selector Tabs */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          {SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => setActiveTab(sample.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-150 ${
                activeTab === sample.id
                  ? 'bg-white text-black shadow-md'
                  : 'border border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {sample.tabLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Main Before-After Inspection Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Side (5 Cols): The Raw Human Input */}
        <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#0E0F16]/95 p-6 sm:p-7 flex flex-col justify-between shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Bahasa Awam (Masukan Pengguna)
              </span>
              <span className="text-[10px] font-mono text-white/40">{current.badge}</span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#14151E] p-4 text-[14px] leading-relaxed text-white/90 italic font-sans relative">
              {current.rawIdea}
            </div>

            <p className="mt-3 text-[11px] text-white/40">{current.rawContext}</p>

            {/* AI Architectural Gap-Analysis */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-pink-400 mb-2.5">
                Celah Kritis yang Dilengkapi Otomatis oleh AI:
              </p>
              <ul className="space-y-2">
                {current.missingPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/70 leading-relaxed">
                    <CheckCircle2 size={14} className="text-pink-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-white/40">Tertarik dengan alur ini?</span>
            <button
              type="button"
              onClick={handleTryPreset}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] hover:bg-white/15 border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white transition active:scale-95"
            >
              <span>Uji Ide Ini</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Right Side (7 Cols): The Structured Technical Output */}
        <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#0E0F16]/95 p-6 sm:p-7 flex flex-col justify-between shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3.5 mb-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Spesifikasi Teknis (Keluaran Siap Pakai)
              </span>

              {/* Sub-view switcher */}
              <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
                <button
                  type="button"
                  onClick={() => setSpecView('db')}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition ${
                    specView === 'db' ? 'bg-white text-black font-semibold' : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Database size={11} />
                  <span>Basis Data</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSpecView('api')}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition ${
                    specView === 'api' ? 'bg-white text-black font-semibold' : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Code2 size={11} />
                  <span>REST API</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSpecView('rules')}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition ${
                    specView === 'rules' ? 'bg-white text-black font-semibold' : 'text-white/50 hover:text-white'
                  }`}
                >
                  <FileText size={11} />
                  <span>Aturan Bisnis</span>
                </button>
              </div>
            </div>

            {/* Spec View Content */}
            <div className="min-h-[260px] rounded-2xl border border-white/10 bg-[#090A0F] p-4 font-mono">
              {specView === 'db' && (
                <div className="space-y-3 text-xs">
                  <div className="text-[11px] text-white/40 border-b border-white/10 pb-1.5">
                    // Skema Relasi Database Terverifikasi
                  </div>
                  {current.tables.map((t) => (
                    <div key={t.name} className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-pink-400">{t.name}</span>
                        <span className="text-[10px] text-white/40">// {t.desc}</span>
                      </div>
                      <div className="text-[11px] text-white/60 pl-3">
                        kolom: <span className="text-white/80">{t.columns}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {specView === 'api' && (
                <div className="space-y-2.5 text-xs">
                  <div className="text-[11px] text-white/40 border-b border-white/10 pb-1.5">
                    // Spesifikasi Kontrak Endpoint REST API
                  </div>
                  {current.endpoints.map((e) => (
                    <div
                      key={e.path}
                      className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                            e.method === 'POST'
                              ? 'bg-pink-500/20 text-pink-300'
                              : e.method === 'GET'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {e.method}
                        </span>
                        <span className="text-white/90 text-[11px]">{e.path}</span>
                      </div>
                      <span className="text-[10px] text-white/40 font-sans">{e.desc}</span>
                    </div>
                  ))}
                </div>
              )}

              {specView === 'rules' && (
                <div className="space-y-2.5 text-xs font-sans">
                  <div className="text-[11px] text-white/40 border-b border-white/10 pb-1.5 font-mono">
                    // Kriteria Selesai & Aturan Validasi Bisnis
                  </div>
                  {current.businessRules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-white/75 text-xs leading-relaxed">
                      <span className="font-mono text-pink-400 font-bold shrink-0">{idx + 1}.</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Prompt Export Stamp */}
          <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
            <span className="flex items-center gap-1.5">
              <Terminal size={13} className="text-pink-400" />
              <span>Diformat langsung ke Markdown siap tempel (Cursor/Claude Code)</span>
            </span>
            <span className="text-emerald-400 font-mono text-[11px]">100% Deterministic</span>
          </div>
        </div>
      </div>
    </section>
  );
}
