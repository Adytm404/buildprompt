import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { deriveBadge } from '@/lib/blueprint';
import { computeCompleteness, computeCompletenessFrom } from '@/services/interviewService';
import type { Answers, Project } from '@/types';

interface ProjectContextValue {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createProject: (idea: string) => Promise<Project>;
  getProject: (id: string) => Project | undefined;
  saveInterview: (id: string, answers: Answers, currentStep: number) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  completeInterview: (id: string) => void;
  renameProject: (id: string, name: string) => Promise<void>;
  duplicateProject: (id: string) => Promise<Project | undefined>;
  deleteProject: (id: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced write-behind sync so rapid interview edits coalesce into one PATCH.
  const timers = useRef<Record<string, number>>({});
  const pending = useRef<Record<string, Partial<Project>>>({});

  const flush = useCallback((id: string) => {
    const patch = pending.current[id];
    delete pending.current[id];
    const timer = timers.current[id];
    if (timer) window.clearTimeout(timer);
    delete timers.current[id];
    if (!patch) return;
    api
      .updateProject(id, patch)
      .then(({ project }) => {
        setProjects((prev) => prev.map((item) => (item.id === id ? project : item)));
      })
      .catch(() => {
        // Keep the optimistic state; a later refresh reconciles with the server.
      });
  }, []);

  const queueSync = useCallback(
    (id: string, patch: Partial<Project>) => {
      pending.current[id] = { ...(pending.current[id] ?? {}), ...patch };
      if (timers.current[id]) window.clearTimeout(timers.current[id]);
      timers.current[id] = window.setTimeout(() => flush(id), 450);
    },
    [flush],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { projects: list } = await api.listProjects();
      setProjects(list);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Gagal memuat proyek.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      void refresh();
    } else {
      setProjects([]);
      setError(null);
    }
  }, [isAuthenticated, refresh]);

  useEffect(() => {
    const timersRef = timers;
    return () => {
      Object.values(timersRef.current).forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const getProject = useCallback((id: string) => projects.find((project) => project.id === id), [projects]);

  const applyLocal = useCallback((id: string, patch: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch, updatedAt: Date.now() } : item)),
    );
  }, []);

  const createProject = useCallback(async (idea: string) => {
    const { project } = await api.createProject(idea.trim());
    setProjects((prev) => [project, ...prev.filter((item) => item.id !== project.id)]);
    return project;
  }, []);

  const updateProject = useCallback(
    (id: string, patch: Partial<Project>) => {
      applyLocal(id, patch);
      queueSync(id, patch);
    },
    [applyLocal, queueSync],
  );

  const saveInterview = useCallback(
    (id: string, answers: Answers, currentStep: number) => {
      const existing = projects.find((project) => project.id === id);
      if (!existing) return;
      const badge = deriveBadge(answers);
      const completeness =
        existing.questions && existing.questions.length > 0
          ? computeCompletenessFrom(existing.questions, answers)
          : computeCompleteness(existing.idea, answers);
      const patch: Partial<Project> = { answers, currentStep, badge, completeness };
      applyLocal(id, patch);
      queueSync(id, patch);
    },
    [projects, applyLocal, queueSync],
  );

  const completeInterview = useCallback(
    (id: string) => {
      const existing = projects.find((project) => project.id === id);
      if (!existing) return;
      const patch: Partial<Project> = {
        completed: true,
        status: existing.status === 'generated' ? 'generated' : 'reviewing',
        completeness: Math.max(existing.completeness, 92),
      };
      applyLocal(id, patch);
      queueSync(id, patch);
    },
    [projects, applyLocal, queueSync],
  );

  const renameProject = useCallback(async (id: string, name: string) => {
    const cleanName = name.trim() || 'Project tanpa nama';
    applyLocal(id, { name: cleanName });
    const { project } = await api.updateProject(id, { name: cleanName });
    setProjects((prev) => prev.map((item) => (item.id === id ? project : item)));
  }, [applyLocal]);

  const duplicateProject = useCallback(async (id: string) => {
    try {
      const { project } = await api.duplicateProject(id);
      setProjects((prev) => [project, ...prev.filter((item) => item.id !== project.id)]);
      return project;
    } catch {
      return undefined;
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
    try {
      await api.deleteProject(id);
    } catch {
      // Re-sync with the server if deletion failed.
    }
  }, []);

  const value = useMemo<ProjectContextValue>(
    () => ({
      projects,
      loading,
      error,
      refresh,
      createProject,
      getProject,
      saveInterview,
      updateProject,
      completeInterview,
      renameProject,
      duplicateProject,
      deleteProject,
    }),
    [
      projects,
      loading,
      error,
      refresh,
      createProject,
      getProject,
      saveInterview,
      updateProject,
      completeInterview,
      renameProject,
      duplicateProject,
      deleteProject,
    ],
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject(): ProjectContextValue {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within ProjectProvider');
  return context;
}
