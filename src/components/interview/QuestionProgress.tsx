import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface QuestionProgressProps {
  current: number;
  total: number;
  percent: number;
}

export function QuestionProgress({ current, total, percent }: QuestionProgressProps) {
  const dots = Array.from({ length: Math.min(Math.max(total, 1), 12) });

  return (
    <div className="flex items-center gap-4 text-white">
      {/* Precision Progress Dots */}
      <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
        {dots.map((_, index) => (
          <motion.span
            key={index}
            initial={false}
            animate={{
              width: index === current - 1 ? 22 : 6,
              opacity: index < current ? 1 : 0.3,
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={cn(
              'h-1.5 rounded-full',
              index === current - 1
                ? 'bg-gradient-to-r from-pink-500 to-indigo-500 shadow-[0_0_8px_rgba(236,72,153,0.4)]'
                : index < current
                  ? 'bg-white/60'
                  : 'bg-white/20',
            )}
          />
        ))}
      </div>

      {/* Progress Counter & Metric */}
      <div className="flex items-center gap-2 text-xs">
        <span className="tabular-nums text-white/70">
          Langkah <strong className="font-semibold text-white">{current}</strong>
          <span className="text-white/40"> / sekitar {Math.max(total, current)}</span>
        </span>
        <span className="hidden text-white/25 sm:inline">•</span>
        <span className="hidden tabular-nums sm:inline text-white/70">
          <strong className="font-semibold text-pink-300">{Math.round(percent)}%</strong>{' '}
          <span className="text-white/40">lengkap</span>
        </span>
      </div>
    </div>
  );
}
