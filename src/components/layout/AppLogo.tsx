import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AppLogoProps {
  withText?: boolean;
  to?: string;
  className?: string;
  textClassName?: string;
  dark?: boolean;
}

export function AppLogo({ withText = true, to = '/', className, textClassName, dark = false }: AppLogoProps) {
  const content = (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      {/* Lovable-inspired warm heart/flame emblem with vibrant gradient */}
      <span className="relative flex h-7 w-7 items-center justify-center shrink-0">
        <svg viewBox="0 0 32 32" className="h-full w-full" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="lovableHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B4A" />
              <stop offset="35%" stopColor="#FF3366" />
              <stop offset="70%" stopColor="#C026D3" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <path
            d="M16 28.5C16 28.5 4 20.5 4 11.5C4 7 7.5 3.5 12 3.5C14.5 3.5 15.5 4.5 16 5.5C16.5 4.5 17.5 3.5 20 3.5C24.5 3.5 28 7 28 11.5C28 20.5 16 28.5 16 28.5Z"
            fill="url(#lovableHeartGrad)"
          />
        </svg>
      </span>
      {withText ? (
        <span
          className={cn(
            'text-[18px] font-bold tracking-tight font-sans',
            dark ? 'text-white' : 'text-ink',
            textClassName,
          )}
        >
          buildprompt
        </span>
      ) : null}
    </span>
  );

  if (!to) return content;
  return (
    <Link to={to} aria-label="buildprompt" className="rounded-xl inline-flex items-center focus:outline-none">
      {content}
    </Link>
  );
}
