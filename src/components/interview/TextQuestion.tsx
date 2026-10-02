import { useEffect } from 'react';
import { useAutoResize } from '@/hooks/useAutoResize';
import { cn } from '@/lib/utils';

interface TextQuestionProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  rows?: number;
  className?: string;
}

export function TextQuestion({
  value,
  onChange,
  placeholder,
  autoFocus = true,
  rows = 3,
  className,
}: TextQuestionProps) {
  const ref = useAutoResize<HTMLTextAreaElement>(value);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus, ref]);

  return (
    <textarea
      ref={ref}
      rows={rows}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={cn(
        // Outer R = 16px (fits within 28px card with 12px gap)
        'w-full resize-none rounded-[16px] border border-white/15 bg-[#12131C] px-5 py-4 text-[15px] leading-relaxed text-white outline-none transition placeholder:text-white/30 focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/40 shadow-inner',
        className,
      )}
    />
  );
}
