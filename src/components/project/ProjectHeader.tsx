import { Pencil, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ProjectHeaderProps {
  projectName: string;
  badge: string;
  description: string;
  primaryLabel: string;
  onPrimary: () => void;
  primaryLoading?: boolean;
  primaryIcon?: ReactNode;
  onEdit?: () => void;
  actions?: ReactNode;
}

export function ProjectHeader({
  projectName,
  badge,
  description,
  primaryLabel,
  onPrimary,
  primaryLoading = false,
  primaryIcon,
  onEdit,
  actions,
}: ProjectHeaderProps) {
  return (
    <div className="border-b border-white/10 pb-6 text-white">
      {/* Breadcrumb with crisp white/muted contrast */}
      <nav className="text-xs text-white/40" aria-label="Breadcrumb">
        <Link to="/projects/all" className="transition hover:text-white">
          Proyek
        </Link>
        <span className="mx-2 text-white/20">/</span>
        <span className="text-white/80">{projectName}</span>
      </nav>

      <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            {/* Heading in bold crisp white with SF Pro Rounded */}
            <h1 className="text-3xl sm:text-4xl font-rounded font-bold tracking-tight text-white">{projectName}</h1>
            <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-2.5 py-0.5 text-xs font-semibold text-pink-300">
              {badge}
            </span>
          </div>
          {/* Description in readable light text */}
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-white/65">{description}</p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          {actions}
          {onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10 active:scale-95"
            >
              <Pencil size={13} />
              <span>Ubah Kebutuhan</span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={onPrimary}
            disabled={primaryLoading}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md transition hover:opacity-95 active:scale-95 disabled:opacity-50"
          >
            {primaryIcon ?? <Sparkles size={14} />}
            <span>{primaryLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
