import { motion } from 'framer-motion';
import { Sparkles, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ProjectNotFound } from '@/components/feedback/ProjectNotFound';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { DocumentViewer } from '@/components/result/DocumentViewer';
import { CompletenessCard } from '@/components/project/CompletenessCard';
import { FeatureAccordion } from '@/components/project/FeatureAccordion';
import { FeatureCard } from '@/components/project/FeatureCard';
import { ProjectHeader } from '@/components/project/ProjectHeader';
import { RequirementDrawer } from '@/components/project/RequirementDrawer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { Segmented } from '@/components/ui/Segmented';
import { Tooltip } from '@/components/ui/Tooltip';
import { useProject } from '@/context/ProjectContext';
import { projectReviewNavItems } from '@/data/navigation';
import { buildResult } from '@/lib/blueprint';
import { slugify } from '@/lib/utils';
import { computeCompleteness } from '@/services/interviewService';
import type { Answers, ApiEndpoint } from '@/types';

const methodStyles: Record<ApiEndpoint['method'], string> = {
  GET: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  POST: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
  PUT: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  PATCH: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  DELETE: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
};

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
      {description ? <p className="mt-1 text-xs text-white/50">{description}</p> : null}
    </div>
  );
}

export function ReviewPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getProject, updateProject } = useProject();
  const project = projectId ? getProject(projectId) : undefined;

  const initialSection = searchParams.get('section') ?? 'overview';
  const [active, setActive] = useState(initialSection);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dbMode, setDbMode] = useState('simple');
  const [apiMode, setApiMode] = useState('simple');

  useEffect(() => {
    const s = searchParams.get('section');
    if (s) setActive(s);
  }, [searchParams]);

  const blueprint = useMemo(() => (project ? buildResult(project) : undefined), [project]);
  const navItems = useMemo(() => (project ? projectReviewNavItems(project.id) : []), [project]);

  if (!project || !blueprint) {
    return <ProjectNotFound />;
  }

  const selectSection = (id: string) => {
    if (id === 'prompt') {
      navigate(`/dashboard/project/${project.id}/prompt`);
      return;
    }
    setActive(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveRequirements = (answers: Answers) => {
    updateProject(project.id, { answers, completeness: computeCompleteness(project.idea, answers) });
  };

  const structure = [
    'Dashboard',
    ...blueprint.features.filter((feature) => feature.id !== 'dashboard').map((feature) => feature.title),
    'Pengaturan',
  ];

  return (
    <SidebarLayout
      projectName={project.name}
      projectItems={navItems}
      activeId={active}
      onSelect={selectSection}
      onSettings={() => setDrawerOpen(true)}
      title={project.name}
    >
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10 text-white">
        <ProjectHeader
          projectName={project.name}
          badge={blueprint.badge}
          description={project.description}
          primaryLabel="Buat PRD Prompt"
          primaryIcon={<Sparkles size={16} />}
          onPrimary={() => navigate(`/dashboard/project/${project.id}/prompt`)}
          onEdit={() => setDrawerOpen(true)}
        />

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="py-8"
        >
          {active === 'overview' ? (
            <div className="space-y-8">
              <CompletenessCard value={project.completeness} />

              <div>
                <SectionTitle title="Ringkasan" />
                <p className="max-w-3xl text-[15px] leading-relaxed text-white/70">{blueprint.summary}</p>
              </div>

              <div>
                <SectionTitle title="Fitur utama" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {blueprint.features.map((feature) => (
                    <FeatureCard key={feature.id} title={feature.title} description={feature.description} />
                  ))}
                </div>
              </div>

              <div>
                <SectionTitle title="Pengguna" />
                <div className="flex flex-wrap gap-2">
                  {blueprint.users.map((user) => (
                    <span
                      key={user}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#14151E] px-3.5 py-1.5 text-xs font-medium text-white/80"
                    >
                      <Users size={13} className="text-pink-400" />
                      {user}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-[#12131C]/90 p-6 shadow-2xl backdrop-blur-xl">
                  <SectionTitle title="Struktur aplikasi" description="Gambaran bagian utama aplikasimu." />
                  <ul className="space-y-1">
                    {structure.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/[0.03]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#12131C]/90 p-6 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-3">
                    <SectionTitle title="Rekomendasi teknologi" />
                    <Tooltip content="Pilihan ini dibuat berdasarkan kebutuhan dan cara aplikasi akan digunakan.">
                      <Badge variant="accent" className="gap-1.5 whitespace-nowrap bg-pink-500/10 border-pink-500/30 text-pink-300">
                        <Sparkles size={12} />
                        Direkomendasikan AI
                      </Badge>
                    </Tooltip>
                  </div>
                  <ul className="space-y-3">
                    {blueprint.stack.map((item) => (
                      <li key={item.label} className="flex items-center gap-3.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                          <DynamicIcon name={item.icon} size={17} />
                        </span>
                        <div>
                          <p className="text-[11px] text-white/40">{item.label}</p>
                          <p className="text-sm font-semibold text-white">{item.value}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}

          {active === 'features' ? (
            <div>
              <SectionTitle title="Fitur utama" description="Rincian fitur yang akan dibangun." />
              <FeatureAccordion features={blueprint.features} />
            </div>
          ) : null}

          {active === 'pages' ? (
            <div>
              <SectionTitle title="Halaman aplikasi" description="Susunan halaman yang akan dibuat." />
              <div className="space-y-6">
                {Array.from(new Set(blueprint.pages.map((page) => page.group))).map((group) => (
                  <div key={group}>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">{group}</p>
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#12131C]">
                      {blueprint.pages
                        .filter((page) => page.group === group)
                        .map((page) => (
                          <div
                            key={page.path}
                            className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5 last:border-0"
                          >
                            <span className="font-mono text-[13px] font-medium text-pink-400">{page.path}</span>
                            <span className="text-[13px] text-white/50">{page.label}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {active === 'database' ? (
            <div>
              <div className="mb-6 flex items-center justify-between gap-4">
                <SectionTitle title="Struktur data" description="Data apa saja yang disimpan aplikasi." />
                <Segmented
                  ariaLabel="database-mode"
                  options={[
                    { value: 'simple', label: 'Sederhana' },
                    { value: 'technical', label: 'Teknis' },
                  ]}
                  value={dbMode}
                  onChange={setDbMode}
                />
              </div>
              {!blueprint.hasData ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
                  <p className="text-sm text-white/50">
                    Aplikasi ini tidak perlu menyimpan data, jadi tidak ada struktur basis data.
                  </p>
                </div>
              ) : dbMode === 'simple' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {blueprint.database.simple.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-white/10 bg-[#14151E] p-5 shadow-2xl">
                      <h3 className="text-[15px] font-semibold text-white">{item.title}</h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">{item.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {blueprint.database.tables.map((table) => (
                    <div
                      key={table.name}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-[#12131C] shadow-2xl"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-5 py-3">
                        <span className="font-mono text-sm font-semibold text-white">{table.name}</span>
                        <span className="text-xs text-white/50">{table.columns.length} kolom</span>
                      </div>
                      <ul className="divide-y divide-white/10">
                        {table.columns.map((column) => (
                          <li key={column.name} className="flex items-center justify-between gap-3 px-5 py-2.5">
                            <span className="font-mono text-[13px] text-white/80">{column.name}</span>
                            <span className="font-mono text-[11px] text-white/40">{column.type}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {active === 'api' ? (
            <div>
              <div className="mb-6 flex items-center justify-between gap-4">
                <SectionTitle title="API" description="Cara aplikasi bertukar data." />
                <Segmented
                  ariaLabel="api-mode"
                  options={[
                    { value: 'simple', label: 'Sederhana' },
                    { value: 'technical', label: 'Teknis' },
                  ]}
                  value={apiMode}
                  onChange={setApiMode}
                />
              </div>
              {apiMode === 'simple' ? (
                <div className="rounded-2xl border border-white/10 bg-[#14151E] p-6 shadow-2xl">
                  <p className="text-[15px] leading-relaxed text-white/70">{blueprint.api.simple}</p>
                </div>
              ) : blueprint.api.endpoints.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
                  <p className="text-sm text-white/50">Aplikasi ini tidak memerlukan API.</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#12131C]">
                  {blueprint.api.endpoints.map((endpoint) => (
                    <div
                      key={`${endpoint.method}-${endpoint.path}`}
                      className="flex flex-wrap items-center gap-3 border-b border-white/10 px-5 py-3.5 last:border-0"
                    >
                      <span
                        className={`rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold ${methodStyles[endpoint.method]}`}
                      >
                        {endpoint.method}
                      </span>
                      <span className="font-mono text-[13px] text-white/90">{endpoint.path}</span>
                      <span className="ml-auto text-[13px] text-white/40">{endpoint.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {active === 'prd' ? (
            <DocumentViewer
              title={`PRD — ${project.name}`}
              sections={blueprint.prd}
              fileName={`${slugify(project.name)}-prd.md`}
            />
          ) : null}

          {active === 'stack' ? (
            <div>
              <SectionTitle title="Rekomendasi teknologi" description="Dipilih sesuai kebutuhan aplikasimu." />
              <div className="grid gap-4 sm:grid-cols-2">
                {blueprint.stack.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#14151E] p-5 shadow-2xl"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                      <DynamicIcon name={item.icon} size={20} />
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.06em] text-white/40">{item.label}</p>
                      <p className="text-[15px] font-semibold text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
                  Penerapan: {blueprint.deployment}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/dashboard/project/${project.id}/prompt`)}
                  leftIcon={<Sparkles size={14} />}
                  className="bg-white text-black hover:bg-white/90 rounded-full"
                >
                  Buat PRD Prompt
                </Button>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>

      <RequirementDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        project={project}
        onSave={saveRequirements}
      />
    </SidebarLayout>
  );
}
