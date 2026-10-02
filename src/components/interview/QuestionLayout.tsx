import { Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

interface QuestionLayoutProps {
  label?: string;
  contextual?: boolean;
  title: string;
  helper?: string;
  children: ReactNode;
}

export function QuestionLayout({ label, contextual, title, helper, children }: QuestionLayoutProps) {
  return (
    <div className="w-full text-white">
      {/* Category Eyebrow Badge */}
      {label ? (
        <div className="mb-5 flex items-center gap-2">
          {contextual ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-500/20 text-pink-400">
              <Sparkles size={13} />
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-3.5 py-1 text-[11px] font-semibold tracking-wider uppercase text-pink-300">
            {label}
          </span>
        </div>
      ) : null}

      {/* Main Question Title with Natural Breathing Room & Balanced Line Height */}
      <h2 className="text-balance text-2xl sm:text-3xl md:text-[2.25rem] font-bold text-white tracking-tight leading-[1.32] sm:leading-[1.36]">
        {title}
      </h2>

      {/* Helper Context Subtitle */}
      {helper ? (
        <p className="mt-3.5 max-w-xl text-[14px] sm:text-[15px] leading-relaxed text-white/60 font-sans">
          {helper}
        </p>
      ) : null}

      {/* Options & Interactive Area */}
      <div className="mt-8">{children}</div>
    </div>
  );
}
