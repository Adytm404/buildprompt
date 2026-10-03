import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Copy, MoreHorizontal, Pencil, Plus, Search, Share2, Trash2 } from 'lucide-react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/feedback/EmptyState';
import { AIComposer } from '@/components/layout/AIComposer';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ShareProjectModal } from '@/components/project/ShareProjectModal';
import { Progress } from '@/components/ui/Progress';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/ToastProvider';
import { useAuth } from '@/context/AuthContext';
import { useProject } from '@/context/ProjectContext';
import { formatRelativeTime } from '@/lib/utils';
import type { Project } from '@/types';

function projectHref(project: Project): string {
  if (project.status === 'generated') return `/dashboard/project/${project.id}/prompt`;
  if (project.status === 'reviewing') return `/dashboard/project/${project.id}/review`;
  return `/dashboard/project/${project.id}/interview`;
}

interface ProjectCardProps {
  project: Project;
  onOpen: () => void;
  onShare: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(function ProjectCard(
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
      className="group relative"
    >
      <button
        type="button"
        onClick={onOpen}
        className="w-full rounded-2xl border border-white/10 bg-[#14151D]/80 p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-[#1A1C26] hover:shadow-2xl text-white"
      >
        <div className="flex items-start justify-between gap-3 pr-8">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold tracking-tight text-white group-hover:text-pink-300 transition-colors">
              {project.name}
            </h3>
            <p className="mt-0.5 text-xs text-white/50">{project.badge}</p>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${
              project.status === 'generated'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-pink-500/30 bg-pink-500/10 text-pink-400'
            }`}
          >
            {project.status === 'generated' ? 'Selesai' : 'Cetak biru siap'}
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-white/60">{project.description}</p>

        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between text-[11px]">
            <span className="text-white/40">Diperbarui {formatRelativeTime(project.updatedAt)}</span>
            <span className="font-semibold text-white/80">{project.completeness}% Selesai</span>
          </div>
          <Progress
            value={project.completeness}
            className="h-1.5 bg-white/10"
            barClassName="bg-gradient-to-r from-pink-500 to-indigo-500"
          />
        </div>
      </button>

      <div ref={menuRef} className="absolute right-3.5 top-3.5">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-lg p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white"
          aria-label="Menu project"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <MoreHorizontal size={16} />
        </button>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              role="menu"
              className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-xl border border-white/10 bg-[#161720] p-1 shadow-2xl backdrop-blur-xl"
            >
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
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

export function ProjectsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects, loading: projectsLoading, createProject, renameProject, duplicateProject, deleteProject } =
    useProject();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'generated' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [shareTarget, setShareTarget] = useState<Project | null>(null);
  const [renameTarget, setRenameTarget] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [draftName, setDraftName] = useState('');

  // Quick Composer at top (Lovable Gambar 2/3 style)
  const [quickIdea, setQuickIdea] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 300);
    return () => window.clearTimeout(timer);
  }, []);

  const handleQuickSubmit = async () => {
    if (!quickIdea.trim()) return;
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
      if (user.monthlyUsed >= user.monthlyLimit) {
        toast({
          title: 'Kuota Bulanan Habis',
          description: `Kuota bulanan Anda untuk paket Gratis sudah habis (${user.monthlyUsed}/${user.monthlyLimit} bulan ini). Upgrade ke Pro untuk akses tanpa batas.`,
          variant: 'error',
        });
        navigate('/dashboard/pricing');
        return;
      }
    }
    try {
      const project = await createProject(quickIdea.trim());
      navigate(`/dashboard/project/${project.id}/interview`);
    } catch (error) {
      toast({
        title: 'Gagal membuat proyek',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan.',
        variant: 'error',
      });
      if (error instanceof Error && error.message.toLowerCase().includes('kuota')) {
        navigate('/dashboard/pricing');
      }
    }
  };

  const handleRename = async () => {
    if (!renameTarget) return;
    const target = renameTarget;
    setRenameTarget(null);
    try {
      await renameProject(target.id, draftName);
      toast({ title: 'Project diubah namanya', variant: 'success' });
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
      toast({ title: 'Project diduplikasi', description: `${project.name} (copy)`, variant: 'success' });
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
      toast({ title: 'Project dihapus' });
    } catch (error) {
      toast({
        title: 'Gagal menghapus',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan.',
        variant: 'error',
      });
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (filter === 'generated' && p.status !== 'generated') return false;
    if (filter === 'draft' && p.status === 'generated') return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <SidebarLayout activeId="studio" title="AI Studio">
      <div className="flex flex-col min-h-[calc(100vh-2px)] justify-between text-white">
        {/* Section 1: Hero & Chat Box (Hampir 100vh / Vertically Centered ala Gambar 2) */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-12 sm:py-16 text-center w-full max-w-4xl mx-auto min-h-[75vh] sm:min-h-[80vh]">
          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 px-3.5 text-xs text-white/80 shadow-sm backdrop-blur-md">
              <span className="rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 px-2 py-0.5 text-[9px] font-bold text-white tracking-wide">
                STUDIO AI
              </span>
              <span>Rancang PRD instan dengan model DeepSeek v4.1</span>
              <ArrowRight size={13} className="text-white/40" />
            </div>
          </motion.div>

          {/* Centered Hero Greeting (Gambar 2 style) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="max-w-xl mx-auto"
          >
            <h1 className="text-3xl sm:text-5xl font-rounded font-bold tracking-tight text-white leading-tight">
              Apa yang ingin Anda rancang?
            </h1>
            <p className="mt-3 text-sm sm:text-base font-sans text-white/50 leading-relaxed">
              Tuliskan ide aplikasi atau fitur baru. AI kami akan merancang PRD teknisnya untuk Anda.
            </p>
          </motion.div>

          {/* Centered Dark Composer Capsule (Gambar 2) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-8 w-full max-w-2xl text-left"
          >
            {user?.plan === 'free' && user.dailyUsed >= user.dailyLimit ? (
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-200">
                <span>
                  Kuota gratis hari ini telah digunakan (<strong>{user.dailyUsed}/{user.dailyLimit}</strong>).
                </span>
                <Link to="/dashboard/pricing" className="font-semibold text-rose-300 hover:text-white underline">
                  Upgrade ke Pro untuk kuota tanpa batas →
                </Link>
              </div>
            ) : null}
            <AIComposer
              value={quickIdea}
              onChange={setQuickIdea}
              onSubmit={handleQuickSubmit}
              dark
              placeholder="Tuliskan ide aplikasi untuk mulai merancang PRD..."
            />
          </motion.div>

          {/* Scroll Down Hint to History */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-10 flex items-center gap-1.5 text-xs text-white/35"
          >
            <span>Riwayat proyek di bawah</span>
            <ChevronDown size={14} className="animate-bounce opacity-70" />
          </motion.div>
        </div>

        {/* Section 2: Bottom History Shelf (Ukuran kanan kirinya hampir mepet) */}
        <div className="w-full px-2 sm:px-4 pb-2">
          <div className="w-full rounded-t-3xl border-t border-x border-white/10 bg-[#0E0F16]/95 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
            {/* Filter Pills Bar (Gambar 2 style) */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari proyek..."
                    className="rounded-full border border-white/10 bg-white/[0.03] pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-white/30 outline-none focus:border-white/25 w-36 sm:w-48"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    filter === 'all'
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'bg-white/[0.04] text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  Semua Proyek
                </button>

                <button
                  type="button"
                  onClick={() => setFilter('generated')}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    filter === 'generated'
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'bg-white/[0.04] text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  PRD Selesai
                </button>

                <button
                  type="button"
                  onClick={() => setFilter('draft')}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    filter === 'draft'
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'bg-white/[0.04] text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  Draf
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs text-white/40 hidden sm:inline">{filteredProjects.length} Proyek</span>
                <Link
                  to="/dashboard/projects/all"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/15 hover:text-white"
                >
                  <span>Lihat semua proyek</span>
                  <ArrowRight size={13} />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    if (user?.plan === 'free' && user.dailyUsed >= user.dailyLimit) {
                      toast({
                        title: 'Kuota Harian Habis',
                        description: `Kuota harian Anda untuk paket Gratis sudah habis (${user.dailyUsed}/${user.dailyLimit} hari ini). Upgrade ke Pro untuk akses tanpa batas.`,
                        variant: 'error',
                      });
                      navigate('/dashboard/pricing');
                      return;
                    }
                    navigate('/new');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-black transition hover:bg-white/90 active:scale-95 shadow-sm"
                >
                  <Plus size={13} strokeWidth={2.5} />
                  <span>Proyek Baru</span>
                </button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="mt-6">
              {loading || projectsLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-2xl border border-white/10 bg-[#14151D] p-5">
                      <Skeleton className="h-4 w-32 bg-white/10" />
                      <Skeleton className="mt-2.5 h-3 w-20 bg-white/10" />
                      <Skeleton className="mt-4 h-3 w-full bg-white/10" />
                      <Skeleton className="mt-5 h-1.5 w-full bg-white/10" />
                    </div>
                  ))}
                </div>
              ) : filteredProjects.length === 0 ? (
                <EmptyState
                  title="Belum ada proyek"
                  description="Mulai dari satu ide sederhana atau gunakan kotak input di atas."
                  action={
                    <button
                      type="button"
                      onClick={() => navigate('/new')}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-semibold text-black transition hover:bg-white/90 active:scale-95 shadow-md"
                    >
                      <Plus size={15} strokeWidth={2.5} />
                      <span>Buat proyek pertama</span>
                    </button>
                  }
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                      <ProjectCard
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
            <Button variant="ghost" size="sm" onClick={() => setRenameTarget(null)}>
              Batal
            </Button>
            <Button variant="secondary" size="sm" onClick={handleRename} disabled={!draftName.trim()}>
              Simpan
            </Button>
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
          className="mt-2 w-full rounded-2xl border border-white/10 bg-[#161720] px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
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
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>
              Batal
            </Button>
            <Button
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 active:bg-rose-800"
              onClick={handleDelete}
              leftIcon={<Trash2 size={14} />}
            >
              Hapus
            </Button>
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
