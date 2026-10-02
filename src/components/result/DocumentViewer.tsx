import { Check, Copy, Download } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { useClipboard } from '@/hooks/useClipboard';
import { downloadText } from '@/lib/download';
import type { PrdSection } from '@/types';

interface DocumentViewerProps {
  title: string;
  sections: PrdSection[];
  fileName: string;
}

export function DocumentViewer({ title, sections, fileName }: DocumentViewerProps) {
  const { copied, copy } = useClipboard();

  const documentText = useMemo(
    () => sections.map((section) => `## ${section.title}\n\n${section.body.join('\n')}`).join('\n\n'),
    [sections],
  );

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#12131C]/90 shadow-2xl backdrop-blur-xl text-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-white">{title}</h3>
          <p className="text-xs text-white/50">Dokumen siap dibagikan ke tim pengembang atau agen AI.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copy(documentText)}
            leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}
            className="border-white/15 bg-white/[0.04] text-white hover:bg-white/10 rounded-full text-xs"
          >
            {copied ? 'Tersalin' : 'Salin PRD'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => downloadText(fileName, `${title}\n\n${documentText}`)}
            leftIcon={<Download size={14} />}
            className="bg-white text-black hover:bg-white/90 rounded-full text-xs"
          >
            Unduh
          </Button>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-5 py-8 sm:px-10 sm:py-12">
        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className="mb-10 scroll-mt-24 last:mb-0">
            <div className="flex items-baseline gap-3">
              <span className="text-xs font-semibold tabular-nums text-pink-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2 className="text-xl font-semibold tracking-tight text-white">{section.title}</h2>
            </div>
            <div className="mt-4 space-y-2.5 border-l-2 border-white/10 pl-5">
              {section.body.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="text-[14px] leading-relaxed text-white/70">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </article>
    </div>
  );
}
