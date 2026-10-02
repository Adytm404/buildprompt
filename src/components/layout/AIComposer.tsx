import { ArrowUp, ChevronDown, Mic, Paperclip, Plus } from 'lucide-react';
import { useEffect, type KeyboardEvent } from 'react';
import { useAutoResize } from '@/hooks/useAutoResize';
import { cn } from '@/lib/utils';

interface AIComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  submitting?: boolean;
  detailsOpen?: boolean;
  onToggleDetails?: () => void;
  details?: string;
  onDetailsChange?: (value: string) => void;
  dark?: boolean;
  placeholder?: string;
}

export function AIComposer({
  value,
  onChange,
  onSubmit,
  submitting = false,
  detailsOpen = false,
  onToggleDetails,
  details = '',
  onDetailsChange,
  dark = false,
  placeholder = 'Ask buildprompt to create an app about...',
}: AIComposerProps) {
  const textareaRef = useAutoResize<HTMLTextAreaElement>(value, 160);
  const detailsRef = useAutoResize<HTMLTextAreaElement>(details, 120);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [textareaRef]);

  const canSubmit = value.trim().length > 0 && !submitting;

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (canSubmit) onSubmit();
    }
  };

  return (
    <div
      className={cn(
        'w-full transition-all duration-200 rounded-[28px] border shadow-2xl relative',
        dark
          ? 'bg-[#14151D]/90 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] focus-within:border-white/25'
          : 'bg-white/95 border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.06)] focus-within:border-black/20 focus-within:shadow-[0_12px_40px_rgba(0,0,0,0.1)]',
        'p-3 sm:p-4',
      )}
    >
      <label htmlFor="idea-input" className="sr-only">
        Ceritakan ide aplikasimu
      </label>
      <textarea
        id="idea-input"
        ref={textareaRef}
        rows={2}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'w-full resize-none bg-transparent px-3 py-1.5 text-[16px] sm:text-[17px] leading-relaxed outline-none',
          dark ? 'text-white placeholder:text-white/35' : 'text-ink placeholder:text-ink-faint',
        )}
      />

      {detailsOpen ? (
        <div
          className={cn(
            'mx-1 my-2 rounded-2xl border border-dashed px-3.5 py-2.5',
            dark ? 'border-white/15 bg-white/[0.03]' : 'border-line bg-bg/70',
          )}
        >
          <textarea
            ref={detailsRef}
            rows={2}
            value={details}
            onChange={(event) => onDetailsChange?.(event.target.value)}
            placeholder="Detail tambahan (opsional): target pengguna, fitur wajib, referensi tampilan..."
            className={cn(
              'w-full resize-none bg-transparent text-sm leading-relaxed outline-none',
              dark ? 'text-white/90 placeholder:text-white/30' : 'text-ink-soft placeholder:text-ink-faint',
            )}
          />
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-2 pt-2 px-1">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleDetails}
            className={cn(
              'inline-flex items-center justify-center h-8 w-8 rounded-full border transition-colors',
              dark
                ? 'border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                : 'border-black/10 text-ink-muted hover:bg-black/5 hover:text-ink',
              detailsOpen && (dark ? 'bg-white/15 text-white' : 'bg-black/10 text-ink'),
            )}
            title="Tambahkan detail"
            aria-label="Tambahkan detail"
          >
            <Plus size={16} className={cn('transition-transform', detailsOpen && 'rotate-45')} />
          </button>

          <button
            type="button"
            className={cn(
              'hidden sm:inline-flex items-center justify-center h-8 w-8 rounded-full border transition-colors',
              dark
                ? 'border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                : 'border-black/10 text-ink-faint hover:bg-black/5 hover:text-ink',
            )}
            title="Lampiran (segera hadir)"
            aria-label="Lampiran"
          >
            <Paperclip size={14} />
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Mode Selector Pill (Lovable "Build v" style) */}
          <div
            className={cn(
              'hidden sm:flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium cursor-pointer transition select-none',
              dark ? 'text-white/70 hover:bg-white/5' : 'text-ink-muted hover:bg-black/5',
            )}
          >
            <span>Generator PRD</span>
            <ChevronDown size={13} className="opacity-60" />
          </div>

          <button
            type="button"
            className={cn(
              'hidden sm:inline-flex items-center justify-center h-8 w-8 rounded-full transition-colors',
              dark ? 'text-white/50 hover:text-white' : 'text-ink-faint hover:text-ink',
            )}
            aria-label="Masukan suara"
          >
            <Mic size={16} />
          </button>

          {/* Submit Circle Up Arrow (Lovable Signature) */}
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            aria-label="Mulai"
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200',
              canSubmit
                ? dark
                  ? 'bg-white text-black hover:bg-white/90 shadow-md hover:scale-105 active:scale-95'
                  : 'bg-black text-white hover:bg-zinc-800 shadow-md hover:scale-105 active:scale-95'
                : dark
                  ? 'bg-white/10 text-white/30 cursor-not-allowed'
                  : 'bg-black/10 text-black/30 cursor-not-allowed',
            )}
          >
            <ArrowUp size={17} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}
