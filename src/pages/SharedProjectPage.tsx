import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  Copy,
  Database,
  FileCode,
  Globe,
  Layers,
  Network,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppLogo } from '@/components/layout/AppLogo';
import { DitherWave } from '@/components/landing/DitherWave';
import { ProjectNotFound } from '@/components/feedback/ProjectNotFound';
import { PromptDocument } from '@/components/result/PromptDocument';
import { FeatureAccordion } from '@/components/project/FeatureAccordion';
import { getProjectTechStack } from '@/components/project/TechLogos';
import { useClipboard } from '@/hooks/useClipboard';
import { useProject } from '@/context/ProjectContext';
import { useToast } from '@/components/ui/ToastProvider';
import { buildResult, PROMPT_TARGETS } from '@/lib/blueprint';
import { localPrdPrompt } from '@/services/ai/aiPrd';
import { decodeProjectPayload } from '@/lib/sharePayload';
import { formatDate } from '@/lib/utils';
import type { Project } from '@/types';

export function SharedProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getProject, createProject } = useProject();
  const { copied, copy } = useClipboard();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'prompt' | 'spec'>('prompt');
  const [target, setTarget] = useState<string>(PROMPT_TARGETS[0]);
  const [resolvedProject, setResolvedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Try local storage lookup
    if (projectId) {
      const local = getProject(projectId);
      if (local) {
        setResolvedProject(local);
        setLoading(false);
        return;
      }
    }

    // 2. Try URL Hash payload
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#d=')) {
      const encoded = window.location.hash.slice(3);
      const decoded = decodeProjectPayload(encoded);
      if (decoded) {
        setResolvedProject(decoded);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
  }, [projectId, getProject]);

  const project = resolvedProject;
  const blueprint = useMemo(() => (project ? buildResult(project) : null), [project]);
  const techStack = useMemo(
    () => (project ? getProjectTechStack(project.answers?.platform as string | undefined) : []),
    [project],
  );

  const prdPrompt = useMemo(() => {
    if (!project) return '';
    if (project.prdPrompt) return project.prdPrompt;
    return localPrdPrompt(project, target);
  }, [project, target]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center text-white">
        <div className="flex items-center gap-3 text-sm text-white/60">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <span>Memuat dokumen PRD...</span>
        </div>
      </div>
    );
  }

  if (!project || !blueprint) {
    return (
      <ProjectNotFound
        title="Dokumen PRD Tidak Ditemukan"
        description="Tautan ini mungkin sudah kadaluarsa atau tidak lengkap. Pastikan URL yang dibagikan sudah benar."
      />
    );
  }

  const handleCopyLink = () => {
    copy(window.location.href);
    toast({
      title: 'Tautan disalin',
      description: 'Siapa saja dapat membuka dokumen PRD ini tanpa login.',
      variant: 'success',
    });
  };

  const handleClone = () => {
    const cloned = createProject(project.idea);
    toast({
      title: 'Disimpan ke Studio',
      description: `Proyek "${project.name}" berhasil ditambahkan ke akun Anda.`,
      variant: 'success',
    });
    navigate(`/dashboard/project/${cloned.id}/prompt`);
  };

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white flex flex-col selection:bg-purple-500/30">
      {/* Top Public Navigation Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0A0B0F]/85 border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <AppLogo dark />
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-purple-300">
              <Globe size={12} className="text-purple-400" />
              <span>Dokumen PRD Publik</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10 active:scale-95"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copied ? 'Tersalin' : 'Bagikan'}</span>
            </button>

            <button
              type="button"
              onClick={handleClone}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/15 px-3.5 py-1.5 text-xs font-semibold text-purple-200 transition hover:bg-purple-500/25 active:scale-95"
            >
              <Sparkles size={13} />
              <span>Salin ke Studio Saya</span>
            </button>

            <Link
              to="/new"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-black transition hover:bg-white/90 active:scale-95 shadow-sm"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span>Rancang PRD Baru</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative flex-1 mx-auto w-full max-w-5xl px-4 sm:px-8 py-8 sm:py-12 z-10">
        {/* Project Header Banner */}
        <div className="rounded-3xl border border-white/10 bg-[#12131C]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-2.5 py-0.5 text-xs font-semibold text-pink-300">
                  {blueprint.badge}
                </span>
                <span className="text-xs text-white/40">
                  Terakhir diperbarui {formatDate(project.updatedAt)}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold font-rounded tracking-tight text-white">
                {project.name}
              </h1>
              <p className="mt-2 text-sm text-white/65 max-w-2xl leading-relaxed">
                {blueprint.summary}
              </p>
            </div>

            {/* Official Tech Stack Dock */}
            <div className="shrink-0 flex sm:flex-col items-start sm:items-end gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                Arsitektur Rekomendasi
              </span>
              <div className="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-black/60 p-2 shadow-inner">
                {techStack.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex flex-col items-center justify-center w-12 h-12 rounded-xl border border-white/5 bg-white/[0.03] p-1"
                    title={tech.name}
                  >
                    <div className="h-6 w-6 flex items-center justify-center shrink-0">
                      {tech.icon}
                    </div>
                    <span className="text-[8px] font-mono text-white/70 mt-0.5 truncate max-w-full">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation View Switcher (Tabs) */}
          <div className="mt-6 flex items-center justify-between">
            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('prompt')}
                className={`flex items-center gap-2 rounded-full px-4 py-2 font-medium transition ${
                  activeTab === 'prompt'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <FileCode size={14} />
                <span>Prompt PRD AI Koding</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('spec')}
                className={`flex items-center gap-2 rounded-full px-4 py-2 font-medium transition ${
                  activeTab === 'spec'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Layers size={14} />
                <span>Spesifikasi & Cetak Biru</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-white/40">
              <Sparkles size={12} className="text-purple-400" />
              <span>Siap tempel ke Cursor / Claude Code</span>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'prompt' ? (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <PromptDocument
                title="Prompt Spesifikasi PRD Siap Pakai"
                description="Salin prompt ini langsung ke agen AI koding (Cursor, Claude Code, Codex, Windsurf) untuk mulai membangun aplikasi."
                prompt={prdPrompt}
                targets={PROMPT_TARGETS}
                target={target}
                onTargetChange={setTarget}
                fileName={`${project.name.toLowerCase().replace(/\s+/g, '-')}-prd.md`}
              />
            </motion.div>
          ) : (
            <motion.div
              key="spec"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Features List */}
              <div className="rounded-3xl border border-white/10 bg-[#12131C]/90 p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-pink-400" />
                  <span>Fitur Utama Aplikasi</span>
                </h3>
                <FeatureAccordion features={blueprint.features} />
              </div>

              {/* Database Schema */}
              <div className="rounded-3xl border border-white/10 bg-[#12131C]/90 p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Database size={16} className="text-cyan-400" />
                    <span>Skema Basis Data (SQLite)</span>
                  </h3>
                  <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-mono text-cyan-300">
                    Prisma / Drizzle ORM
                  </span>
                </div>

                <div className="space-y-3">
                  {blueprint.database.tables.map((table) => (
                    <div
                      key={table.name}
                      className="rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                        <span className="font-bold text-purple-300">{table.name}</span>
                        <span className="text-[10px] text-white/40">{table.columns.length} kolom</span>
                      </div>
                      <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                        {table.columns.map((col) => (
                          <div
                            key={col.name}
                            className="flex items-center justify-between rounded-lg bg-white/[0.03] px-2.5 py-1.5 text-[11px]"
                          >
                            <span className="text-white/80">{col.name}</span>
                            <span className="text-white/40">{col.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Endpoints */}
              <div className="rounded-3xl border border-white/10 bg-[#12131C]/90 p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Network size={16} className="text-emerald-400" />
                  <span>Arsitektur REST API</span>
                </h3>
                <div className="space-y-2">
                  {blueprint.api.endpoints.map((ep) => (
                    <div
                      key={`${ep.method}-${ep.path}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            ep.method === 'GET'
                              ? 'bg-blue-500/20 text-blue-300'
                              : ep.method === 'POST'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : ep.method === 'PUT' || ep.method === 'PATCH'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="text-white font-medium">{ep.path}</span>
                      </div>
                      <span className="text-white/50 text-[11px] font-sans">{ep.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA Card */}
        <div className="mt-12 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-[#1B1435] to-[#120F24] p-8 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-lg mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/40 bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-200 mb-3">
              <Sparkles size={12} />
              <span>Dibuat dengan buildprompt</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-rounded tracking-tight">
              Ingin membuat PRD seperti ini untuk ide Anda?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed">
              Mulai gratis dengan kuota harian. AI kami akan memandu wawancara teknis dan menyusun spesifikasi lengkap dalam hitungan detik.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/new"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90 active:scale-95 shadow-lg"
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>Rancang Produk Sekarang</span>
              </Link>
              <Link
                to="/dashboard/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                <span>Lihat Paket Langganan</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Ambient Canvas Accent */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-64 overflow-hidden opacity-25 z-0">
        <DitherWave
          pixelSize={6}
          speed={0.4}
          primaryColor="#7C3AED"
          secondaryColor="#3B0764"
          waveBaseHeight={0.35}
          amplitude={30}
          ditherDepth={60}
          interactive={false}
        />
      </div>
    </div>
  );
}
