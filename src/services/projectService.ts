import { createProject, seedProjects } from '@/data/mockProject';
import { readStorage, writeStorage } from '@/lib/storage';
import { uid } from '@/lib/utils';
import type { Project } from '@/types';

const PROJECTS_KEY = 'projects';

export function listProjects(): Project[] {
  const stored = readStorage<Project[] | null>(PROJECTS_KEY, null);
  if (stored !== null) return stored;
  const seeded = seedProjects();
  writeStorage(PROJECTS_KEY, seeded);
  return seeded;
}

export function saveProjects(projects: Project[]): void {
  writeStorage(PROJECTS_KEY, projects);
}

export function getProject(id: string): Project | undefined {
  return listProjects().find((project) => project.id === id);
}

export function createNewProject(idea: string): Project {
  const project = createProject(idea);
  saveProjects([project, ...listProjects()]);
  return project;
}

export function updateProject(project: Project): Project {
  const updated = { ...project, updatedAt: Date.now() };
  saveProjects(listProjects().map((item) => (item.id === updated.id ? updated : item)));
  return updated;
}

export function deleteProject(id: string): void {
  saveProjects(listProjects().filter((project) => project.id !== id));
}

export function duplicateProject(id: string): Project | undefined {
  const original = getProject(id);
  if (!original) return undefined;
  const copy: Project = {
    ...original,
    id: uid('proj'),
    name: `${original.name} (copy)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  saveProjects([copy, ...listProjects()]);
  return copy;
}
