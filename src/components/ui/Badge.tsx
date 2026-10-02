import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'accent' | 'outline' | 'success';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-bg text-ink-soft border-line',
  accent: 'bg-accent-50 text-accent-700 border-accent-100',
  outline: 'bg-transparent text-ink-muted border-line',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = 'default', className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
