import { useCallback, useEffect, useRef, useState } from 'react';

async function writeToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export function useClipboard(resetAfter = 2000) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const copy = useCallback(
    async (text: string) => {
      try {
        await writeToClipboard(text);
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), resetAfter);
        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [resetAfter],
  );

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { copied, copy };
}
