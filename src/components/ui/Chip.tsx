import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: ReactNode;
  shortcut?: string;
}

export function Chip({ selected = false, icon, shortcut, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150',
        selected
          ? 'border-accent bg-accent-50 text-accent-700'
          : 'border-line bg-surface text-ink-soft hover:border-lineStrong hover:text-ink',
        className,
      )}
      {...rest}
    >
      {icon ? <span className="text-current">{icon}</span> : null}
      <span>{children}</span>
      {shortcut ? (
        <span
          className={cn(
            'ml-0.5 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase transition',
            selected ? 'border-accent-200 text-accent-600' : 'border-line text-ink-faint',
          )}
        >
          {shortcut}
        </span>
      ) : null}
    </button>
  );
}
