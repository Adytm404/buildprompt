import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'subtle';
type Size = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-ink text-white hover:bg-ink-soft active:bg-black disabled:bg-line disabled:text-ink-faint shadow-soft',
  secondary:
    'bg-accent text-white hover:bg-accent-600 active:bg-accent-700 disabled:bg-accent-200 shadow-soft',
  outline:
    'border border-line bg-surface text-ink hover:border-lineStrong hover:bg-bg disabled:text-ink-faint',
  ghost: 'text-ink-soft hover:bg-black/[0.04] hover:text-ink disabled:text-ink-faint',
  subtle: 'bg-accent-50 text-accent-700 hover:bg-accent-100 disabled:text-accent-300',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 gap-1.5 rounded-xl px-3 text-[13px]',
  md: 'h-11 gap-2 rounded-2xl px-4 text-sm',
  lg: 'h-12 gap-2 rounded-2xl px-5 text-[15px]',
  icon: 'h-10 w-10 rounded-full',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex select-none items-center justify-center font-medium transition-all duration-150',
        'disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : leftIcon}
      {children}
      {!loading ? rightIcon : null}
    </button>
  );
}
