import { ArrowLeft, ArrowRight, CornerDownLeft } from 'lucide-react';

interface InterviewNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  showNext?: boolean;
  nextDisabled?: boolean;
  hint?: string;
}

export function InterviewNavigation({
  onBack,
  onNext,
  nextLabel = 'Lanjut',
  showNext = false,
  nextDisabled = false,
  hint = 'Tekan Enter ↵',
}: InterviewNavigationProps) {
  return (
    <div className="mt-8 pt-6 flex items-center justify-between gap-3 border-t border-white/10">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition active:scale-95"
        >
          <ArrowLeft size={14} />
          <span>Sebelumnya</span>
        </button>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-3">
        {hint ? (
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs text-white/40 font-mono">
            <CornerDownLeft size={12} className="text-white/30" />
            <span>{hint}</span>
          </span>
        ) : null}

        {showNext ? (
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-2.5 text-xs sm:text-sm font-semibold text-black transition-all duration-150 hover:bg-white/90 active:scale-95 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span>{nextLabel}</span>
            <ArrowRight size={14} strokeWidth={2.2} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
