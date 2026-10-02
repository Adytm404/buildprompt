import { Check, ChevronDown, Copy, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useClipboard } from '@/hooks/useClipboard';
import { downloadText } from '@/lib/download';

interface PromptDocumentProps {
  title: string;
  description: string;
  prompt: string;
  targets: readonly string[];
  target: string;
  onTargetChange: (target: string) => void;
  fileName: string;
  streaming?: boolean;
  error?: string | null;
  onRegenerate?: () => void;
}

export function PromptDocument({
  title,
  description,
  prompt,
  targets,
  target,
  onTargetChange,
  fileName,
  streaming = false,
  error,
  onRegenerate,
}: PromptDocumentProps) {
  const { copied, copy } = useClipboard();
  const disabled = streaming || prompt.trim().length === 0;

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#12131C]/90 shadow-2xl backdrop-blur-xl text-white">
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-7 border-b border-white/10">
        <div className="min-w-0">
          <h2 className="text-lg font-bold tracking-tight text-white">{title}</h2>
          <p className="mt-0.5 text-xs text-white/50">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Target Model Selector */}
          <label className="relative">
            <span className="sr-only">Pilih AI koding</span>
            <select
              value={target}
              onChange={(event) => onTargetChange(event.target.value)}
              disabled={streaming}
              className="appearance-none rounded-full border border-white/15 bg-white/[0.04] py-1.5 pl-3.5 pr-8 text-xs font-medium text-white/90 outline-none transition hover:border-white/30 focus:border-white/50 disabled:opacity-50 cursor-pointer"
            >
              {targets.map((item) => (
                <option key={item} value={item} className="bg-[#12131C] text-white">
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
            />
          </label>

          {onRegenerate ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              loading={streaming}
              leftIcon={<RefreshCw size={13} />}
              className="border-white/15 bg-white/[0.04] text-white hover:bg-white/10 rounded-full text-xs"
            >
              Buat Ulang
            </Button>
          ) : null}

          <Button
            variant="outline"
            size="sm"
            onClick={() => copy(prompt)}
            disabled={disabled}
            leftIcon={copied ? <Check size={13} /> : <Copy size={13} />}
            className="border-white/15 bg-white/[0.04] text-white hover:bg-white/10 rounded-full text-xs"
          >
            {copied ? 'Tersalin' : 'Salin'}
          </Button>

          <button
            type="button"
            onClick={() => downloadText(fileName, prompt)}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-black transition hover:bg-white/90 active:scale-95 disabled:opacity-40 shadow-sm"
          >
            <Download size={13} strokeWidth={2.2} />
            <span>Unduh .md</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="mx-5 my-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-300 sm:mx-7">
          <span>{error}</span>
        </div>
      ) : null}

      {/* Code Document Surface */}
      <div className="relative mx-5 mb-5 sm:mx-7 sm:mb-7 overflow-hidden rounded-2xl border border-white/10 bg-[#090A0E] mt-4">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5 bg-white/[0.02]">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="ml-3 font-mono text-[11px] text-white/40">{fileName}</span>
          {streaming ? (
            <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-pink-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-pink-400" />
              menyusun PRD…
            </span>
          ) : null}
        </div>
        <pre className="max-h-[65vh] overflow-auto p-5 font-mono text-[12.5px] leading-relaxed text-white/85">
          <code>{prompt}</code>
          {streaming ? <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-white/70 align-middle" /> : null}
        </pre>
      </div>
    </div>
  );
}
