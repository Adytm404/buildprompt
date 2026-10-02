import { Progress } from '@/components/ui/Progress';

interface CompletenessCardProps {
  value: number;
  title?: string;
  description?: string;
}

export function CompletenessCard({
  value,
  title = 'Cetak Biru Proyek',
  description = 'Kami sudah memiliki informasi yang cukup untuk membuat spesifikasi aplikasi.',
}: CompletenessCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#12131C]/90 p-6 shadow-2xl backdrop-blur-xl text-white">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50">{title}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-white">
            {Math.round(value)}% <span className="text-sm font-normal text-white/50">siap dibuat</span>
          </p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-xs font-bold text-pink-300">
          {Math.round(value)}
        </span>
      </div>
      <Progress
        value={value}
        className="mt-5 h-2 bg-white/10"
        barClassName="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
      />
      <p className="mt-3 text-xs leading-relaxed text-white/50">{description}</p>
    </div>
  );
}
