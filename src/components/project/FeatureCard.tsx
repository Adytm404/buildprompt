import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  meta?: string;
  className?: string;
}

export function FeatureCard({ title, description, icon, meta, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-[#14151E]/90 p-5 text-white transition duration-150 hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#1A1C28]',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        {icon ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
            {icon}
          </span>
        ) : null}
        {meta ? <span className="text-xs font-medium text-white/40">{meta}</span> : null}
      </div>
      <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-white">{title}</h3>
      {description ? <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">{description}</p> : null}
    </div>
  );
}
