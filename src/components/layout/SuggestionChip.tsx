import { cn } from '@/lib/utils';

interface SuggestionChipProps {
  label: string;
  onClick: () => void;
  className?: string;
  dark?: boolean;
}

export function SuggestionChip({ label, onClick, className, dark = false }: SuggestionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-1.5 text-[13px] font-medium transition-all duration-150 hover:-translate-y-0.5',
        dark
          ? 'border-white/10 bg-white/[0.04] text-white/75 hover:border-white/25 hover:bg-white/10 hover:text-white'
          : 'border-black/[0.08] bg-white/90 text-ink-soft hover:border-black/25 hover:bg-white hover:text-ink shadow-sm',
        className,
      )}
    >
      {label}
    </button>
  );
}
