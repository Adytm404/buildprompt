import { motion } from 'framer-motion';
import { Sparkles, Users } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProjectNotFound } from '@/components/feedback/ProjectNotFound';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { RequirementDrawer } from '@/components/project/RequirementDrawer';
import { PromptDocument } from '@/components/result/PromptDocument';
import { Button } from '@/components/ui/Button';
import { useProject } from '@/context/ProjectContext';
import { projectPromptNavItems } from '@/data/navigation';
import { buildResult, PROMPT_TARGETS } from '@/lib/blueprint';
import { AIError } from '@/lib/aiClient';
import { describeAIError } from '@/lib/aiError';
import { slugify } from '@/lib/utils';
import { computeCompleteness } from '@/services/interviewService';
import { localPrdPrompt, streamPrdPrompt } from '@/services/ai/aiPrd';
import type { Answers } from '@/types';

export function PromptPage() {
  const { projectId } = useParams();
  const { getProject, updateProject } = useProject();
  const project = projectId ? getProject(projectId) : undefined;

  const [target, setTarget] = useState<string>(PROMPT_TARGETS[0]);
  const [prompt, setPrompt] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const initedRef = useRef<string | null>(null);

  const result = useMemo(() => (project ? buildResult(project) : null), [project]);
  const navItems = useMemo(() => (project ? projectPromptNavItems(project.id) : []), [project]);

  const generate = useCallback(
    async (targetValue: string) => {
      if (!project) return;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setStreaming(true);
      setError(null);
      setPrompt('');
      let accumulated = '';

      try {
        const full = await streamPrdPrompt(project, {
          target: targetValue,
          signal: controller.signal,
          onDelta: (delta) => {
            accumulated += delta;
            setPrompt(accumulated);
          },
        });
        setPrompt(full);
        updateProject(project.id, { prdPrompt: full, status: 'generated', completeness: 100 });
      } catch (caught) {
        if (caught instanceof AIError && caught.code === 'aborted') return;
        const local = localPrdPrompt(project, targetValue);
        setPrompt(local);
        updateProject(project.id, { prdPrompt: local, status: 'generated', completeness: 100 });
        setError(
          `${describeAIError(caught)} Untuk sementara kami menampilkan PRD versi lokal yang tetap bisa di-copy dan di-download.`,
        );
      } finally {
        setStreaming(false);
      }
    },
    [project, updateProject],
  );

  const generateRef = useRef(generate);
  generateRef.current = generate;

  useEffect(() => {
    if (!project) return;
    if (initedRef.current === project.id) return;
    initedRef.current = project.id;
    if (project.prdPrompt) {
      setPrompt(project.prdPrompt);
      if (project.status !== 'generated') {
        updateProject(project.id, { status: 'generated', completeness: 100 });
      }
      return;
    }
    void generateRef.current(PROMPT_TARGETS[0]);
  }, [project, updateProject]);

  if (!project || !result) {
    return <ProjectNotFound />;
  }

  const handleTargetChange = (next: string) => {
    setTarget(next);
    void generateRef.current(next);
  };

  const handleSaveRequirements = (answers: Answers) => {
    updateProject(project.id, { answers, completeness: computeCompleteness(project.idea, answers) });
    void generateRef.current(target);
  };

  return (
    <SidebarLayout
      projectName={project.name}
      projectItems={navItems}
      activeId="prompt"
      title="PRD Prompt"
      onSettings={() => setDrawerOpen(true)}
    >
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <nav className="text-xs text-white/40" aria-label="Breadcrumb">
              <Link to="/projects/all" className="transition hover:text-white">
                Proyek
              </Link>
              <span className="mx-2 text-white/20">/</span>
              <span className="text-white/80">{project.name}</span>
            </nav>
            <div className="mt-3 flex items-center gap-3">
              <h1 className="text-3xl font-rounded font-bold tracking-tight text-white sm:text-4xl">
                Prompt PRD Anda Siap
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-2.5 py-0.5 text-xs font-semibold text-pink-300">
                <Sparkles size={12} />
                Prompt PRD
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-white/60">
              Ide Anda telah diubah menjadi spesifikasi teknis yang siap ditempelkan ke agen AI pilihan Anda.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDrawerOpen(true)}
              className="border-white/15 bg-white/[0.04] text-white hover:bg-white/10 rounded-full text-xs"
            >
              Ubah Kebutuhan
            </Button>
            <Link
              to={`/project/${project.id}/review`}
              className="text-xs font-medium text-pink-400 hover:text-pink-300 transition"
            >
              Lihat spesifikasi lengkap →
            </Link>
          </div>
        </div>

        {/* Badges / Specs Pill Row */}
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/75">
            {result.platform}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/75">
            {result.deployment}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/75">
            Gaya: {result.designStyle}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/75">
            <Users size={12} className="text-white/50" />
            {result.users.join(', ')}
          </span>
        </div>

        {/* Feature Tags */}
        <div className="mt-3.5 flex flex-wrap gap-2">
          {result.features.map((feature) => (
            <span
              key={feature.id}
              className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-white/60"
            >
              {feature.title}
            </span>
          ))}
        </div>

        {/* Code / Prompt Document Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          <PromptDocument
            title="Prompt PRD"
            description="Prompt lengkap yang siap Anda berikan ke alat bantu koding AI pilihan Anda."
            prompt={prompt}
            targets={PROMPT_TARGETS}
            target={target}
            onTargetChange={handleTargetChange}
            fileName={`${slugify(project.name)}-prd-prompt.md`}
            streaming={streaming}
            error={error}
            onRegenerate={() => void generateRef.current(target)}
          />
        </motion.div>
      </div>

      <RequirementDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        project={project}
        onSave={handleSaveRequirements}
      />
    </SidebarLayout>
  );
}
