import { Check, Copy, ExternalLink, Globe, Share2 } from 'lucide-react';
import { useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useClipboard } from '@/hooks/useClipboard';
import { buildShareUrl } from '@/lib/sharePayload';
import { getProjectTechStack } from '@/components/project/TechLogos';
import type { Project } from '@/types';

interface ShareProjectModalProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}

export function ShareProjectModal({ project, open, onClose }: ShareProjectModalProps) {
  const { copied, copy } = useClipboard();

  const shareUrl = useMemo(() => {
    if (!project) return '';
    return buildShareUrl(project);
  }, [project]);

  if (!project) return null;

  const stack = getProjectTechStack(project.answers?.platform as string | undefined);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
            <Share2 size={16} />
          </div>
          <div>
            <h3 className="text-base font-bold font-rounded">Bagikan Dokumen PRD</h3>
            <p className="text-[11px] text-white/50 font-normal">Akses publik tanpa perlu login</p>
          </div>
        </div>
      }
      size="md"
    >
      <div className="space-y-4 pt-2 text-white">
        {/* Project Card Preview */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm text-white">{project.name}</h4>
                <span className="rounded-full border border-purple-500/30 bg-purple-500/15 px-2 py-0.5 text-[9px] font-bold text-purple-300">
                  {project.badge || 'Aplikasi Web'}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/60 line-clamp-2">{project.description || project.idea}</p>
            </div>
          </div>

          {/* Tech Stack Mini Dock */}
          <div className="mt-3 flex items-center gap-1.5 pt-3 border-t border-white/10">
            <span className="text-[10px] text-white/40 mr-1">Stack:</span>
            {stack.map((item) => (
              <span
                key={item.name}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/70 font-mono"
              >
                <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">{item.icon}</span>
                <span>{item.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Public Access Notice */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-start gap-2.5">
          <Globe size={16} className="shrink-0 mt-0.5 text-emerald-400" />
          <div className="leading-relaxed">
            <strong className="font-semibold">Tautan Terbuka Publik:</strong> Siapa saja yang memiliki tautan ini dapat membaca spesifikasi teknis, skema basis data, REST API, dan menyalin prompt AI koding tanpa harus membuat akun atau masuk.
          </div>
        </div>

        {/* URL Copy Field */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-1.5">
            Tautan Berbagi
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              onFocus={(e) => e.target.select()}
              className="flex-1 rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs font-mono text-white/90 outline-none focus:border-purple-400 select-all"
            />
            <button
              type="button"
              onClick={() => copy(shareUrl)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition active:scale-95 shrink-0"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Tersalin!' : 'Salin'}</span>
            </button>
          </div>
        </div>

        {/* External Preview Button */}
        <div className="pt-2 flex justify-between items-center border-t border-white/10">
          <span className="text-[11px] text-white/40">Ingin melihat tampilan publiknya?</span>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-300 hover:text-white transition"
          >
            <span>Buka Pratinjau Publik</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </Modal>
  );
}
