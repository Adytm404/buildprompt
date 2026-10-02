import { useCallback, useEffect, useRef } from 'react';

export function useAutoResize<T extends HTMLTextAreaElement>(value: string, maxHeight = 320) {
  const ref = useRef<T | null>(null);

  const resize = useCallback(() => {
    const element = ref.current;
    if (!element) return;
    element.style.height = '0px';
    element.style.height = `${Math.min(element.scrollHeight, maxHeight)}px`;
    element.style.overflowY = element.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [maxHeight]);

  useEffect(() => {
    resize();
  }, [value, resize]);

  useEffect(() => {
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);

  return ref;
}
