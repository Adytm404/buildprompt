import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Copy,
  FolderPlus,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/feedback/EmptyState';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/ToastProvider';
import { useProject } from '@/context/ProjectContext';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import type { Project } from '@/types';

function projectHref(project: Project): string {
  if (project.status === 'generated') return `/project/${project.id}/prompt`;
  if (project.status === 'reviewing') return `/project/${project.id}/review`;
  return `/project/${project.id}/interview`;
}

// Visual mock thumbnail matching Image 1
function ProjectThumbnail({ project }: { project: Project }) {
  const isPos = /(kasir|warung|pos|toko|retail)/i.test(project.name + project.idea);
  const isBooking = /(booking|barber|salon|jadwal)/i.test(project.name + project.idea);
  const isFinance = /(keuangan|finansial|catatan|budget)/i.test(project.name + project.idea);

  const grad = isPos
    ? 'from-rose-950/60 via-pink-900/30 to-[#12131C]'
    : isBooking
      ? 'from-indigo-950/60 via-purple-900/30 to-[#12131C]'
      : isFinance
        ? 'from-cyan-950/60 via-sky-900/30 to-[#12131C]'
        : 'from-fuchsia-950/60 via-violet-900/30 to-[#12131C]';

  return (
    <div
      className={`relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${grad} p-4 transition-transform duration-300 group-hover:scale-[1.02] shadow-lg flex flex-col justify-between`}
    >
      {/* Mini Mock Browser Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 opacity-60">
          <span className="h-2 w-2 rounded-full bg-white/40" />
          <span className="h-2 w-2 rounded-full bg-white/40" />
          <span className="h-2 w-2 rounded-full bg-white/40" />
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${
            project.status === 'generated'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-pink-500/30 bg-pink-500/10 text-pink-400'
          }`}
        >
          {project.status === 'generated' ? 'PRD Siap' : 'Draf'}
        </span>
      </div>

      {/* Mini Mock Layout Center */}
      <div className="my-auto py-2 text-center">
        <p className="font-mono text-[11px] font-bold text-white/90 truncate tracking-tight">{project.name}</p>
        <p className="mt-1 text-[10px] text-white/50 truncate max-w-[200px] mx-auto">{project.badge}</p>
      </div>

      {/* Mini Mock Footer Bar */}
      <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-white/40">
        <span>{project.completeness}% Siap</span>
        <span className="truncate max-w-[100px]">{formatRelativeTime(project.updatedAt)}</span>
      </div>
    </div>
  );
}

interface Image1CardProps {
  project: Project;
  onOpen: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const Image1ProjectCard = forwardRef<HTMLDivElement, Image1CardProps>(function Image1ProjectCard(
  { project, onOpen, onRename, onDuplicate, onDelete },
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
  const { projects, renameProject, duplicateProject, deleteProject } = useProject();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState(true);
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

  const handleRename = () => {
    if (!renameTarget) return;
    renameProject(renameTarget.id, draftName);
    setRenameTarget(null);
    toast({ title: 'Proyek diubah namanya', variant: 'success' });
  };

  const handleDuplicate = (project: Project) => {
    duplicateProject(project.id);
    toast({ title: 'Proyek diduplikasi', description: `${project.name} (salinan)`, variant: 'success' });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteProject(deleteTarget.id);
    setDeleteTarget(null);
    toast({ title: 'Proyek dihapus' });
  };

  return (
    <SidebarLayout activeId="projects" title="Semua Proyek">
      <div className="mx-auto w-full px-5 py-8 sm:px-10 sm:py-10 text-white min-h-screen">
        {/* Top Header Row (Gambar 1) */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Semua Proyek</h1>
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
              onClick={() => navigate('/new')}
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
          {filteredProjects.length === 0 ? (
            <EmptyState
              title="Tidak ada proyek yang ditemukan"
              description="Coba ubah kata kunci pencarian atau buat proyek baru."
              action={
                <button
                  type="button"
                  onClick={() => navigate('/new')}
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
