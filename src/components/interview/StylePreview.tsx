import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StylePreviewProps {
  visual?: 'minimal' | 'saas' | 'fun' | 'corporate' | 'auto';
}

export function StylePreview({ visual = 'minimal' }: StylePreviewProps) {
  return (
    <div className="relative h-16 w-full overflow-hidden rounded-xl border border-line bg-bg" aria-hidden>
      {visual === 'minimal' ? (
        <div className="flex h-full flex-col justify-center gap-1.5 px-3">
          <span className="h-1.5 w-10 rounded-full bg-ink/60" />
          <span className="h-1 w-20 rounded-full bg-line" />
          <span className="h-1 w-14 rounded-full bg-line" />
          <span className="mt-1 h-3 w-12 rounded-full bg-ink/80" />
        </div>
      ) : null}

      {visual === 'saas' ? (
        <div className="flex h-full">
          <div className="w-8 border-r border-line bg-surface p-1.5">
            <span className="mb-1.5 block h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="mb-1 block h-1 w-4 rounded-full bg-line" />
            <span className="block h-1 w-4 rounded-full bg-line" />
          </div>
          <div className="flex flex-1 items-center gap-1.5 p-2">
            <span className="h-8 flex-1 rounded-lg border border-line bg-surface" />
            <span className="h-8 flex-1 rounded-lg border border-line bg-surface" />
            <span className="h-8 w-6 rounded-lg bg-accent/15" />
          </div>
        </div>
      ) : null}

      {visual === 'fun' ? (
        <div className="flex h-full items-center justify-center gap-2">
          <span className="h-8 w-8 rounded-full bg-amber-300" />
          <span className="h-10 w-10 rounded-2xl bg-rose-300" />
          <span className="h-7 w-12 rounded-full bg-sky-300" />
        </div>
      ) : null}

      {visual === 'corporate' ? (
        <div className="flex h-full flex-col gap-1.5 p-2">
          <span className="h-2 w-16 rounded-sm bg-slate-400/60" />
          <div className="flex flex-1 gap-1.5">
            <span className="flex-1 rounded-sm bg-slate-300/60" />
            <span className="flex-1 rounded-sm bg-slate-200" />
            <span className="flex-1 rounded-sm bg-slate-300/60" />
          </div>
        </div>
      ) : null}

      {visual === 'auto' ? (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent-50 via-white to-accent-100">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#6D5DFB] to-[#8B5CF6]">
            <Sparkles size={16} className="text-white" />
          </span>
        </div>
      ) : null}
    </div>
  );
}

export function stylePreviewClass(visual?: StylePreviewProps['visual']): string {
  return cn('transition', visual === 'auto' && 'border-accent-200');
}
