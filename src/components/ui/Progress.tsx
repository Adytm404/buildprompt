import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ProgressProps {
  value: number;
  className?: string;
  barClassName?: string;
  tone?: 'accent' | 'ink';
}

export function Progress({ value, className, barClassName, tone = 'accent' }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-line', className)}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={cn(
          'h-full rounded-full',
          tone === 'accent' ? 'bg-gradient-to-r from-[#6D5DFB] to-[#8B5CF6]' : 'bg-ink',
          barClassName,
        )}
        initial={false}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
}
