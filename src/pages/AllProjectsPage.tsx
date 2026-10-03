import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Copy,
  FolderPlus,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Share2,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/feedback/EmptyState';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { Modal } from '@/components/ui/Modal';
import { ShareProjectModal } from '@/components/project/ShareProjectModal';
import { useToast } from '@/components/ui/ToastProvider';
import { useAuth } from '@/context/AuthContext';
import { useProject } from '@/context/ProjectContext';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { getProjectTechStack } from '@/components/project/TechLogos';
import type { Project } from '@/types';

function projectHref(project: Project): string {
  if (project.status === 'generated') return `/dashboard/project/${project.id}/prompt`;
  if (project.status === 'reviewing') return `/dashboard/project/${project.id}/review`;
  return `/dashboard/project/${project.id}/interview`;
}

function ProjectTechStackBadges({ project }: { project: Project }) {
  const platform = project.answers?.platform as string | undefined;
  const stack = getProjectTechStack(platform);

  return (
    <div className="inline-flex items-center justify-center gap-2 sm:gap-2.5 rounded-2xl border border-white/10 bg-black/60 p-2 sm:p-2.5 backdrop-blur-md shadow-xl">
      {stack.map((item) => (
        <div
          key={item.name}
          className="flex flex-col items-center justify-center w-13 sm:w-14 h-14 sm:h-15 rounded-xl border border-white/5 bg-white/[0.03] p-1.5 transition-all duration-200 group-hover:border-white/20 group-hover:bg-white/[0.07] shadow-sm"
        >
          <div className="flex items-center justify-center h-7 sm:h-7.5 shrink-0">
            {item.icon}
          </div>
          <span className="mt-1 text-[9.5px] font-medium font-sans text-white/75 text-center leading-none">
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}

// Visual mock thumbnail with 16:9 ratio, blueprint grid, and quick action hover
function ProjectThumbnail({ project }: { project: Project }) {
  const isGenerated = project.status === 'generated';

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[18px] border border-white/10 bg-[#0E0B1A] transition-all duration-300 group-hover:scale-[1.02] group-hover:border-purple-400/40 shadow-lg flex flex-col justify-between">
      {/* Blueprint Dotted Background Grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />

      {/* Top Bar: Browser Dots + Status Badge */}
      <div className="relative z-10 flex items-center justify-between p-2.5 sm:p-3 border-b border-white/10 bg-black/25">
        <div className="flex items-center gap-1.5 opacity-60">
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[9px] font-bold font-compact uppercase tracking-wider border ${
            isGenerated
              ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
              : 'border-pink-500/30 bg-pink-500/15 text-pink-300'
          }`}
        >
          {isGenerated ? 'PRD Siap' : 'Draf'}
        </span>
      </div>

      {/* Center: Official Tech Stack Logos */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-1">
        <ProjectTechStackBadges project={project} />
      </div>

      {/* Bottom Bar: Stack & Date */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 bg-black/25 px-3 py-1.5 text-[10px] text-white/40 font-compact">
        <span className="text-purple-300/80 font-mono">Next.js + SQLite</span>
        <span className="truncate">{formatRelativeTime(project.updatedAt)}</span>
      </div>

      {/* Hover Quick Action Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black shadow-xl transform translate-y-1 group-hover:translate-y-0 transition-transform">
          <span>{isGenerated ? 'Buka Prompt PRD' : 'Lanjut Wawancara'}</span>
          <ArrowRight size={13} strokeWidth={2.5} />
        </span>
      </div>
    </div>
  );
}

interface Image1CardProps {
  project: Project;
  onOpen: () => void;
  onShare: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const Image1ProjectCard = forwardRef<HTMLDivElement, Image1CardProps>(function Image1ProjectCard(
  { project, onOpen, onShare, onRename, onDuplicate, onDelete },
  ref,
) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const menuItems = [
    { id: 'share', label: 'Bagikan', icon: Share2, action: onShare },
    { id: 'rename', label: 'Ubah Nama', icon: Pencil, action: onRename },
    { id: 'duplicate', label: 'Duplikatkan', icon: Copy, action: onDuplicate },
    { id: 'delete', label: 'Hapus', icon: Trash2, action: onDelete, danger: true },
  ];

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col text-left"
    >
      {/* Clickable Card Body */}
      <div onClick={onOpen} className="cursor-pointer">
        <ProjectThumbnail project={project} />

        {/* Card Meta Row (Gambar 1 style: Avatar + Title + Edited Date) */}
        <div className="mt-3 flex items-start gap-2.5 px-0.5">
          {/* Avatar Circle */}
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-indigo-600 text-[10px] font-bold text-white shadow-sm mt-0.5">
            {project.name.charAt(0).toUpperCase()}
          </span>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-white group-hover:text-pink-300 transition-colors">
              {project.name}
            </h3>
            <p className="mt-0.5 text-xs text-white/50 truncate">
              Disunting {formatDate(project.updatedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* 3-dots Context Menu Button */}
      <div ref={menuRef} className="absolute right-1 bottom-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((open) => !open);
          }}
          className="rounded-lg p-1.5 text-white/30 transition hover:bg-white/10 hover:text-white"
          aria-label="Menu project"
        >
          <MoreHorizontal size={15} />
        </button>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              role="menu"
              className="absolute right-0 bottom-8 z-30 w-36 overflow-hidden rounded-xl border border-white/10 bg-[#161720] p-1 shadow-2xl backdrop-blur-xl"
            >
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    item.action();
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition ${
                    item.danger ? 'text-rose-400 hover:bg-rose-500/10' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon size={13} />
                  {item.label}
                </button>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

export function AllProjectsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, loading: projectsLoading, renameProject, duplicateProject, deleteProject } = useProject();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState(true);
  const [shareTarget, setShareTarget] = useState<Project | null>(null);
  const [renameTarget, setRenameTarget] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [draftName, setDraftName] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [projects, searchQuery]);

  const handleNewFolder = () => {
    toast({
      title: 'Fitur folder',
      description: 'Pengelompokan folder akan segera hadir.',
      variant: 'default',
    });
  };

  const handleRename = async () => {
    if (!renameTarget) return;
    const target = renameTarget;
    setRenameTarget(null);
    try {
      await renameProject(target.id, draftName);
      toast({ title: 'Proyek diubah namanya', variant: 'success' });
    } catch (error) {
      toast({
        title: 'Gagal mengubah nama',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan.',
        variant: 'error',
      });
    }
  };

  const handleDuplicate = async (project: Project) => {
    try {
      await duplicateProject(project.id);
      toast({ title: 'Proyek diduplikasi', description: `${project.name} (salinan)`, variant: 'success' });
    } catch (error) {
      toast({
        title: 'Gagal menduplikasi',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan.',
        variant: 'error',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await deleteProject(target.id);
      toast({ title: 'Proyek dihapus' });
    } catch (error) {
      toast({
        title: 'Gagal menghapus',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan.',
        variant: 'error',
      });
    }
  };

  return (
    <SidebarLayout activeId="projects" title="Semua Proyek">
      <div className="mx-auto w-full px-5 py-8 sm:px-10 sm:py-10 text-white min-h-screen">
        {/* Top Header Row (Gambar 1) */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-rounded font-bold tracking-tight text-white">Semua Proyek</h1>
          </div>

          <div className="flex items-center gap-2.5">
            {/* New folder button */}
            <button
              type="button"
              onClick={handleNewFolder}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-white/10 active:scale-95"
            >
              <FolderPlus size={14} className="text-white/70" />
              <span>Folder baru</span>
            </button>

            {/* New project blue pill button (Gambar 1) */}
            <button
              type="button"
              onClick={() => {
                if (user?.plan === 'free') {
                  if (user.dailyUsed >= user.dailyLimit) {
                    toast({
                      title: 'Kuota Harian Habis',
                      description: `Kuota harian Anda untuk paket Gratis sudah habis (${user.dailyUsed}/${user.dailyLimit} hari ini). Upgrade ke Pro untuk akses tanpa batas.`,
                      variant: 'error',
                    });
                    navigate('/dashboard/pricing');
                    return;
                  }
                  if (projects.length >= 5) {
                    toast({
                      title: 'Batas Proyek Tercapai',
                      description: 'Paket Gratis maksimal menyimpan 5 proyek aktif. Hapus proyek lama atau upgrade ke Pro.',
                      variant: 'error',
                    });
                    navigate('/dashboard/pricing');
                    return;
                  }
                }
                navigate('/new');
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-1.5 text-xs font-semibold shadow-md active:scale-95 transition"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Proyek baru</span>
            </button>
          </div>
        </div>

        {/* Toolbar & Filters (Gambar 1) */}
        <div className="mt-6 space-y-3">
          {/* Row 1: Search + Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari proyek..."
                className="w-64 sm:w-72 rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3.5 py-1.5 text-xs text-white placeholder:text-white/35 outline-none focus:border-white/25 transition"
              />
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-white/70 hover:bg-white/[0.06] hover:text-white transition"
            >
              <span>Filter</span>
              <ChevronDown size={13} className="opacity-50" />
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-white/70 hover:bg-white/[0.06] hover:text-white transition"
            >
              <SlidersHorizontal size={12} className="opacity-50" />
              <span>Tampilan</span>
              <ChevronDown size={13} className="opacity-50" />
            </button>
          </div>

          {/* Row 2: Active Filter Strip Bar (Gambar 1) */}
          {filterActive ? (
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-white/90">
                  <span>Pemilik: <strong>Anda (Semua)</strong></span>
                  <X
                    size={12}
                    className="cursor-pointer text-white/50 hover:text-white transition"
                    onClick={() => setFilterActive(false)}
                  />
                </span>

                <button
                  type="button"
                  className="rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white transition"
                  title="Tambah filter"
                >
                  <Plus size={13} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFilterActive(false);
                  setSearchQuery('');
                }}
                className="text-[11px] font-medium text-white/40 hover:text-white transition cursor-pointer"
              >
                Hapus filter
              </button>
            </div>
          ) : null}
        </div>

        {/* Projects Grid (Gambar 1) */}
        <div className="mt-8">
          {projectsLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="aspect-[16/9] w-full animate-pulse rounded-[18px] border border-white/10 bg-white/[0.04]" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-white/[0.06]" />
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <EmptyState
              title="Tidak ada proyek yang ditemukan"
              description="Coba ubah kata kunci pencarian atau buat proyek baru."
              action={
                <button
                  type="button"
                  onClick={() => {
                    if (user?.plan === 'free') {
                      if (user.dailyUsed >= user.dailyLimit) {
                        toast({
                          title: 'Kuota Harian Habis',
                          description: `Kuota harian Anda untuk paket Gratis sudah habis (${user.dailyUsed}/${user.dailyLimit} hari ini). Upgrade ke Pro untuk akses tanpa batas.`,
                          variant: 'error',
                        });
                        navigate('/dashboard/pricing');
                        return;
                      }
                      if (projects.length >= 5) {
                        toast({
                          title: 'Batas Proyek Tercapai',
                          description: 'Paket Gratis maksimal menyimpan 5 proyek aktif. Hapus proyek lama atau upgrade ke Pro.',
                          variant: 'error',
                        });
                        navigate('/dashboard/pricing');
                        return;
                      }
                    }
                    navigate('/new');
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#1D4ED8] active:scale-95 shadow-md"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  <span>Proyek baru</span>
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <Image1ProjectCard
                    key={project.id}
                    project={project}
                    onOpen={() => navigate(projectHref(project))}
                    onShare={() => setShareTarget(project)}
                    onRename={() => {
                      setRenameTarget(project);
                      setDraftName(project.name);
                    }}
                    onDuplicate={() => handleDuplicate(project)}
                    onDelete={() => setDeleteTarget(project)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ShareProjectModal
        project={shareTarget}
        open={Boolean(shareTarget)}
        onClose={() => setShareTarget(null)}
      />

      <Modal
        open={Boolean(renameTarget)}
        onClose={() => setRenameTarget(null)}
        title="Ubah nama proyek"
        size="sm"
        footer={
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setRenameTarget(null)}
              className="rounded-full px-4 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleRename}
              disabled={!draftName.trim()}
              className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
            >
              Simpan
            </button>
          </div>
        }
      >
        <label htmlFor="rename-input" className="text-sm font-medium text-white/80">
          Nama proyek
        </label>
        <input
          id="rename-input"
          value={draftName}
          onChange={(event) => setDraftName(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition focus:border-white/30"
          autoFocus
        />
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Hapus proyek?"
        description="Tindakan ini tidak dapat dibatalkan."
        size="sm"
        footer={
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="rounded-full px-4 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-full bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700"
            >
              Hapus
            </button>
          </div>
        }
      >
        <p className="text-sm text-white/70">
          Proyek <span className="font-semibold text-white">{deleteTarget?.name}</span> beserta hasilnya akan dihapus.
        </p>
      </Modal>
    </SidebarLayout>
  );
}
