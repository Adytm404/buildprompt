import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, HelpCircle, Shield, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { PricingCard, type PricingTier } from '@/components/pricing/PricingCard';
import { CheckoutModal } from '@/components/pricing/CheckoutModal';
import { useAuth } from '@/context/AuthContext';

export function PricingPage() {
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [period, setPeriod] = useState<'monthly' | 'quarterly'>('quarterly');

  // Paket Gratis (Selalu tampil di sisi kiri sebagai opsi dasar)
  const freeTier: PricingTier = {
    id: 'free',
    name: 'Gratis',
    tagline: 'Eksplorasi ide dan validasi konsep aplikasi awal.',
    price: 'Rp0',
    period: '/ selamanya',
    priceNote: 'Bebas biaya tanpa kartu kredit',
    quotaLabel: '1x PRD / hari (Maks. 5x / bulan)',
    userBenefit: '1 Akun pengembang',
    speedBenefit: 'Pemrosesan standar',
    ctaText: 'Gunakan Gratis',
    features: [
      'Kuota pembuatan PRD: 1 dokumen / hari (maks. 5 / bulan)',
      'Regenerasi & revisi: 1 kali per dokumen',
      'Akses kecepatan AI: Standar (antrean normal)',
      'Format ekspor dokumen: Markdown (.md) & salin teks',
      'Target coding agent: Cursor, Claude Code, & Codex',
      'Penyimpanan riwayat proyek: Maksimal 5 proyek aktif',
    ],
  };

  // Paket Berbayar Bulanan (Tampil saat toggle "Bulanan" aktif)
  const proMonthlyTier: PricingTier = {
    id: 'pro_monthly',
    name: 'Pro Bulanan',
    tagline: 'Untuk developer & builder produk yang butuh generasi intensif.',
    price: 'Rp100.000',
    period: '/ bulan',
    priceNote: 'Ditagih per bulan, batalkan kapan saja',
    quotaLabel: 'Unlimited PRD (Tanpa Batas)',
    isPopular: true,
    userBenefit: '1 Akun personal prioritas',
    speedBenefit: 'Pemrosesan prioritas tinggi',
    ctaText: 'Pilih Paket Bulanan',
    features: [
      'Kuota pembuatan PRD: Tanpa batas (Unlimited)',
      'Regenerasi & revisi: Tanpa batas sepuasnya',
      'Akses kecepatan AI: Prioritas tinggi tanpa antrean',
      'Format ekspor dokumen: Markdown (.md) & salin teks',
      'Target coding agent: Cursor, Claude Code, & Codex',
      'Penyimpanan riwayat proyek: Tanpa batas riwayat proyek',
    ],
  };

  // Paket Berbayar 3 Bulan (Tampil saat toggle "Paket 3 Bulan" aktif)
  const proQuarterlyTier: PricingTier = {
    id: 'pro_quarterly',
    name: 'Pro 3 Bulan',
    tagline: 'Pilihan paling hemat untuk membangun produk dari ide sampai rilis.',
    price: 'Rp200.000',
    period: '/ 3 bulan',
    priceNote: 'Setara ~Rp66.600/bln • Hemat Rp100.000 (33% OFF)',
    quotaLabel: 'Unlimited PRD (90 Hari Penuh)',
    badge: 'HEMAT RP100.000 • REKOMENDASI',
    isPopular: true,
    userBenefit: '1 Akun personal prioritas',
    speedBenefit: 'Pemrosesan prioritas 90 hari',
    ctaText: 'Pilih Paket 3 Bulan',
    features: [
      'Kuota pembuatan PRD: Tanpa batas (Unlimited 90 hari)',
      'Regenerasi & revisi: Tanpa batas sepuasnya',
      'Akses kecepatan AI: Prioritas tinggi tanpa antrean',
      'Format ekspor dokumen: Markdown (.md) & salin teks',
      'Target coding agent: Cursor, Claude Code, & Codex',
      'Penyimpanan riwayat proyek: Tanpa batas riwayat proyek',
    ],
  };

  // Sesuai permintaan: Toggle memfilter kartu berbayar secara dinamis
  const activePaidTier = period === 'monthly' ? proMonthlyTier : proQuarterlyTier;

  return (
    <SidebarLayout activeId="pricing" title="Paket Langganan">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-8 py-8 sm:py-12 text-white">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/dashboard/projects"
            className="inline-flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white transition"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Studio AI</span>
          </Link>

          {user && (
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>
                Masuk sebagai <strong className="text-white">{user.email}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-compact font-semibold text-purple-300 mb-3 tracking-wide">
            <Sparkles size={12} className="text-purple-400" />
            <span>PILIHAN PAKET FLEKSIBEL</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-rounded tracking-tight text-white leading-tight">
            Pilih Paket Langganan
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/50 leading-relaxed max-w-lg mx-auto">
            Mulai gratis dengan kuota harian atau buka generasi PRD tanpa batas untuk akselerasi koding AI Anda.
          </p>

          {/* Period Toggle Pill: Bulanan vs 3 Bulan */}
          <div className="mt-7 inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.04] p-1 text-xs">
            <button
              type="button"
              onClick={() => setPeriod('monthly')}
              className={`rounded-full px-4 py-1.5 font-medium transition ${
                period === 'monthly'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Bulanan
            </button>
            <button
              type="button"
              onClick={() => setPeriod('quarterly')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 font-medium transition ${
                period === 'quarterly'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>Paket 3 Bulan</span>
              <span className="rounded-full bg-pink-500/20 border border-pink-400/40 px-1.5 py-0.2 text-[10px] font-bold text-pink-300">
                Hemat Rp100rb
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic 2 Cards Grid: Rapi, Lega, Sesuai Toggle */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8 items-stretch">
          {/* Card 1: Gratis */}
          <PricingCard
            tier={freeTier}
            currentPlan={user?.plan}
            onSelect={(t) => setSelectedTier(t)}
          />

          {/* Card 2: Pro (Berganti dinamis antara Bulanan & 3 Bulan sesuai toggle) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePaidTier.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              <PricingCard
                tier={activePaidTier}
                currentPlan={user?.plan}
                onSelect={(t) => setSelectedTier(t)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Value Assurance Row */}
        <div className="mt-14 max-w-4xl mx-auto rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-purple-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Transparan Tanpa Biaya Tersembunyi</h4>
                <p className="mt-0.5 text-[11px] text-white/50">Harga sudah termasuk seluruh fitur arsitektur &amp; ekspor.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield size={18} className="text-purple-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Aktivasi Instan</h4>
                <p className="mt-0.5 text-[11px] text-white/50">Akses tanpa batas langsung aktif sesaat setelah konfirmasi.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HelpCircle size={18} className="text-purple-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Bebas Batalkan Kapan Saja</h4>
                <p className="mt-0.5 text-[11px] text-white/50">Tidak ada ikatan kontrak yang memberatkan pengguna.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Payment Simulation Modal */}
      <CheckoutModal tier={selectedTier} onClose={() => setSelectedTier(null)} />
    </SidebarLayout>
  );
}
