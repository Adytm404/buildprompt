import { Bot, Cpu, MessageSquareQuote } from 'lucide-react';
import { DitherBanner } from '@/components/landing/DitherBanner';

const STEPS = [
  {
    step: '01',
    title: 'Ceritakan Masalah Bisnis Anda',
    highlight: 'Tanpa Istilah Teknis',
    desc: 'Cukup ketik apa yang ingin Anda bangun menggunakan bahasa sehari-hari. Anda tidak perlu memilih PostgreSQL, Docker, atau arsitektur microservices. Ceritakan siapa penggunanya dan apa masalah yang ingin diselesaikan.',
    icon: MessageSquareQuote,
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/20',
    bgBadge: 'bg-amber-500/10 text-amber-300',
  },
  {
    step: '02',
    title: 'Wawancara Adaptif dari AI',
    highlight: 'Menutup Celah Kritis',
    desc: 'AI bertindak sebagai Product Manager senior yang memandu Anda langkah demi langkah. Sistem menanyakan kebutuhan esensial: peran akun, alur transaksi, audit stok, hingga batasan keamanan yang sering terlewatkan oleh pemula.',
    icon: Bot,
    accentColor: 'text-pink-400',
    borderColor: 'border-pink-500/20',
    bgBadge: 'bg-pink-500/10 text-pink-300',
  },
  {
    step: '03',
    title: 'Prompt PRD Siap Dijalankan',
    highlight: 'Langsung Eksekusi Koding',
    desc: 'Hasil akhir adalah satu dokumen Markdown terstandarisasi: mencakup skema tabel relasi, rincian titik akhir REST API, alur logika, dan kriteria selesai. Tinggal salin atau unduh, lalu tempelkan ke Cursor, Claude Code, atau agen AI lainnya.',
    icon: Cpu,
    accentColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/20',
    bgBadge: 'bg-indigo-500/10 text-indigo-300',
  },
];

export function WorkflowSteps() {
  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-24 text-white">
      {/* Header */}
      <div className="text-left sm:text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 mb-3 tracking-wide">
          <span>ALUR KERJA TERARAH</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
          Dirancang untuk Mengubah Kebingungan Menjadi Kepastian Teknis
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-white/50 leading-relaxed">
          Menjembatani pemikiran konseptual seorang founder non-teknis dengan ketelitian matematis yang dibutuhkan oleh agen koding AI modern.
        </p>
      </div>

      {/* 3 Steps Sequence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className={`rounded-3xl border ${s.borderColor} bg-[#0E0F16]/90 p-7 shadow-2xl backdrop-blur-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-white/20`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <span className="font-mono text-2xl font-black tracking-tighter text-white/90">
                    {s.step}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider ${s.bgBadge}`}>
                    {s.highlight}
                  </span>
                </div>

                <div className="mb-4">
                  <span className={`inline-flex p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 ${s.accentColor} mb-3`}>
                    <Icon size={20} />
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight">{s.title}</h3>
                </div>

                <p className="text-xs sm:text-[13px] leading-relaxed text-white/60">
                  {s.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-1.5 text-[11px] font-mono text-white/40">
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                <span>Tahap {s.step} dari 03</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 1:1 Animated Dither Wave Banner matching user's Image 1 */}
      <div className="mt-16">
        <DitherBanner
          title="Buat proyek pertamamu"
          buttonText="Buat proyek pertama"
          to="/new"
        />
      </div>
    </section>
  );
}
