import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import * as projectService from '@/services/projectService';
import { computeCompleteness } from '@/services/interviewService';
import { deriveBadge } from '@/lib/blueprint';
import type { Answers, Project } from '@/types';

interface ProjectContextValue {
  projects: Project[];
  createProject: (idea: string) => Project;
  getProject: (id: string) => Project | undefined;
  saveInterview: (id: string, answers: Answers, currentStep: number) => Project | undefined;
  updateProject: (id: string, patch: Partial<Project>) => Project | undefined;
  completeInterview: (id: string) => void;
  renameProject: (id: string, name: string) => void;
  duplicateProject: (id: string) => Project | undefined;
  deleteProject: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => projectService.listProjects());

  const persistProjects = useCallback((next: Project[]) => {
    projectService.saveProjects(next);
    setProjects(next);
  }, []);

  const getProject = useCallback((id: string) => projects.find((project) => project.id === id), [projects]);

  const createProject = useCallback(
    (idea: string) => {
      const project = projectService.createNewProject(idea);
      const next = [project, ...projectService.listProjects().filter((item) => item.id !== project.id)];
      persistProjects(next);
      return project;
    },
    [persistProjects],
  );

  const updateProject = useCallback(
    (id: string, patch: Partial<Project>) => {
      const existing = projects.find((project) => project.id === id);
      if (!existing) return undefined;
      const updated: Project = {
        ...existing,
        ...patch,
        badge: patch.answers ? deriveBadge(patch.answers) : patch.badge ?? existing.badge,
        completeness: patch.completeness ?? existing.completeness,
        updatedAt: Date.now(),
      };
      persistProjects(projects.map((project) => (project.id === id ? updated : project)));
      return updated;
    },
    [projects, persistProjects],
  );

  const saveInterview = useCallback(
    (id: string, answers: Answers, currentStep: number) => {
      const existing = projects.find((project) => project.id === id);
      if (!existing) return undefined;
      const updated: Project = {
        ...existing,
        answers,
        currentStep,
        badge: deriveBadge(answers),
        completeness: computeCompleteness(existing.idea, answers),
        updatedAt: Date.now(),
      };
      persistProjects(projects.map((project) => (project.id === id ? updated : project)));
      return updated;
    },
    [projects, persistProjects],
  );

  const completeInterview = useCallback(
    (id: string) => {
      const existing = projects.find((project) => project.id === id);
      if (!existing) return;
      const updated: Project = {
        ...existing,
        completed: true,
        status: existing.status === 'generated' ? 'generated' : 'reviewing',
        completeness: Math.max(existing.completeness, 92),
        updatedAt: Date.now(),
      };
      persistProjects(projects.map((project) => (project.id === id ? updated : project)));
    },
    [projects, persistProjects],
  );

  const renameProject = useCallback(
    (id: string, name: string) => {
      updateProject(id, { name: name.trim() || 'Project tanpa nama' });
    },
    [updateProject],
  );

  const duplicateProject = useCallback(
    (id: string) => {
      const copy = projectService.duplicateProject(id);
      if (!copy) return undefined;
      persistProjects([copy, ...projectService.listProjects().filter((item) => item.id !== copy.id)]);
      return copy;
    },
    [persistProjects],
  );

  const deleteProject = useCallback(
    (id: string) => {
      projectService.deleteProject(id);
      persistProjects(projectService.listProjects());
    },
    [persistProjects],
  );

  const value = useMemo<ProjectContextValue>(
    () => ({
      projects,
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
