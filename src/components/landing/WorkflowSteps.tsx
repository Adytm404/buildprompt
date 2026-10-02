import { Bot, Cpu, MessageSquareQuote } from 'lucide-react';
import { DitherBanner } from '@/components/landing/DitherBanner';

const STEPS = [
  {
    step: '01',
    title: 'Ceritakan Masalah Bisnis Anda',
    highlight: 'Tanpa Istilah Teknis',
    desc: 'Cukup ketik apa yang ingin Anda bangun menggunakan bahasa sehari-hari. Anda tidak perlu memilih arsitektur rumit. Ceritakan siapa penggunanya dan apa masalah utama yang ingin diselesaikan.',
    icon: MessageSquareQuote,
    accentColor: 'text-purple-300',
    borderColor: 'border-purple-500/20',
    bgBadge: 'bg-purple-500/15 border border-purple-500/30 text-purple-200',
  },
  {
    step: '02',
    title: 'Wawancara Adaptif dari AI',
    highlight: 'Menutup Celah Kritis',
    desc: 'AI bertindak sebagai Product Manager senior yang memandu Anda langkah demi langkah. Sistem menanyakan kebutuhan esensial: peran akun, alur transaksi, audit data, hingga batasan keamanan yang sering terlewatkan.',
    icon: Bot,
    accentColor: 'text-violet-300',
    borderColor: 'border-purple-500/20',
    bgBadge: 'bg-violet-500/15 border border-violet-500/30 text-violet-200',
  },
  {
    step: '03',
    title: 'Prompt PRD Siap Dijalankan',
    highlight: 'Langsung Eksekusi Koding',
    desc: 'Hasil akhir adalah satu dokumen Markdown terstandarisasi: mencakup skema tabel Next.js + SQLite, rincian endpoint REST API, alur logika, dan kriteria selesai. Tinggal salin atau unduh ke Cursor atau Claude Code.',
    icon: Cpu,
    accentColor: 'text-purple-300',
    borderColor: 'border-purple-500/30',
    bgBadge: 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30 text-purple-100',
  },
];

export function WorkflowSteps() {
  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-20 text-white">
      {/* Cohesive Header */}
      <div className="text-left sm:text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-compact font-semibold text-purple-300 mb-3 tracking-wide">
          <span>ALUR KERJA TERARAH</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-rounded font-bold tracking-tight text-white leading-tight">
          Tiga Tahap Menuju Kepastian Teknis
        </h2>
        <p className="mt-3 text-xs sm:text-sm font-sans text-purple-200/60 leading-relaxed">
          Menjembatani pemikiran konseptual Anda dengan ketelitian matematis yang dibutuhkan oleh agen koding AI modern.
        </p>
      </div>

      {/* 3 Steps Sequence Grid (Outer R = 24px, Inner Icon R = 12px) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className={`rounded-[24px] border ${s.borderColor} bg-[#100922]/80 p-6 sm:p-7 shadow-xl backdrop-blur-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-[0_8px_30px_rgba(109,40,217,0.15)]`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-purple-500/15 pb-4 mb-5">
                  <span className="font-mono text-2xl font-black tracking-tighter text-purple-400/80">
                    {s.step}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-compact font-semibold tracking-wider ${s.bgBadge}`}
                  >
                    {s.highlight}
                  </span>
                </div>

                <div className="mb-3.5">
                  <span
                    className={`inline-flex p-2 rounded-[12px] bg-purple-500/10 border border-purple-500/20 ${s.accentColor} mb-3`}
                  >
                    <Icon size={18} />
                  </span>
                  <h3 className="text-base sm:text-lg font-rounded font-bold text-white tracking-tight">{s.title}</h3>
                </div>

                <p className="text-xs sm:text-[13px] leading-relaxed text-purple-200/60 font-sans">
                  {s.desc}
                </p>
              </div>

              <div className="mt-7 pt-4 border-t border-purple-500/10 flex items-center gap-1.5 text-[11px] font-mono text-purple-300/40">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400/60" />
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
