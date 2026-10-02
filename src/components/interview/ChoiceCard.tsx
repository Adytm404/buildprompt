import { Check, Plus } from 'lucide-react';
import type { QuestionOption } from '@/types';
import { cn } from '@/lib/utils';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { StylePreview } from '@/components/interview/StylePreview';

interface ChoiceCardProps {
  option: QuestionOption;
  selected: boolean;
  multi?: boolean;
  design?: boolean;
  shortcut?: string;
  onClick: () => void;
}

export function ChoiceCard({ option, selected, multi = false, design = false, shortcut, onClick }: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'group relative flex w-full text-left transition-all duration-200',
        design ? 'flex-col gap-3' : 'items-center gap-3.5',
        // Outer Radius = 18px
        'rounded-[18px] border p-3.5 sm:p-4 text-white',
        selected
          ? 'border-pink-500/70 bg-gradient-to-r from-pink-500/[0.15] via-purple-500/[0.08] to-transparent shadow-[0_0_24px_rgba(236,72,153,0.18)] ring-1 ring-pink-500/40'
          : 'border-white/10 bg-[#13141E]/90 hover:-translate-y-0.5 hover:border-white/25 hover:bg-[#181928] shadow-sm',
      )}
    >
      {design ? <StylePreview visual={option.visual} /> : null}

      {/* Icon Wrapper: Inner R = 18px - 8px = 10px according to Outer R = Inner R + Padding rule */}
      {!design && option.icon ? (
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border transition-colors',
            selected
              ? 'border-pink-500/40 bg-pink-500/20 text-pink-300'
              : 'border-white/10 bg-white/[0.04] text-white/60 group-hover:text-white group-hover:border-white/20',
          )}
        >
          <DynamicIcon name={option.icon} size={19} />
        </span>
      ) : null}

      {/* Label and Description */}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-[15px] font-semibold text-white tracking-tight leading-snug">
            {option.title}
          </span>
          {shortcut ? (
            <span
              className={cn(
                'rounded-[6px] border px-1.5 py-0.5 text-[10px] font-bold font-mono uppercase tracking-wider transition-colors',
                selected
                  ? 'border-pink-500/40 bg-pink-500/20 text-pink-300'
                  : 'border-white/15 bg-white/[0.04] text-white/40 group-hover:text-white/60',
              )}
            >
              {shortcut}
            </span>
          ) : null}
        </span>
        {option.description ? (
          <span className="mt-1 block text-[13px] leading-relaxed text-white/55 font-sans">
            {option.description}
          </span>
        ) : null}
      </span>

      {/* Selection Check Circle / Box */}
      <span
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center border transition-all duration-150',
          multi ? 'rounded-[6px]' : 'rounded-full',
          selected
            ? 'border-pink-500 bg-gradient-to-br from-pink-500 to-indigo-600 text-white shadow-md scale-105'
            : 'border-white/20 bg-white/[0.03] text-transparent group-hover:border-white/40',
        )}
        aria-hidden="true"
      >
        {multi && !selected ? (
          <Plus size={13} className="text-white/30 group-hover:text-white/60" />
        ) : (
          <Check size={13} strokeWidth={2.4} />
        )}
      </span>
    </button>
  );
}
