import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function Segmented({ options, value, onChange, className, ariaLabel }: SegmentedProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1', className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative rounded-full px-3.5 py-1 text-xs font-semibold transition-colors',
              active ? 'text-black' : 'text-white/60 hover:text-white',
            )}
          >
            {active ? (
              <motion.span
                layoutId={`segmented-${ariaLabel ?? 'default'}`}
                className="absolute inset-0 rounded-full bg-white shadow-md"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            ) : null}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
