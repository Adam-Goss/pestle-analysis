import { ProjectList, PESTLEEntry } from '../types/models';

const PROJECTS_KEY = 'pestle-projects';
const ENTRIES_KEY = (projectId: string) => `pestle-entries-${projectId}`;
const PROMPTS_KEY = 'pestle-prompts';

export function loadProjects(): ProjectList {
  const data = localStorage.getItem(PROJECTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveProjects(projects: ProjectList): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function loadEntries(projectId: string): PESTLEEntry[] {
  const data = localStorage.getItem(ENTRIES_KEY(projectId));
  return data ? JSON.parse(data) : [];
}

export function saveEntries(projectId: string, entries: PESTLEEntry[]): void {
  localStorage.setItem(ENTRIES_KEY(projectId), JSON.stringify(entries));
}

export function loadPrompts(): Record<string, string[]> {
  const data = localStorage.getItem(PROMPTS_KEY);
  return data ? JSON.parse(data) : {};
}

export function savePrompts(prompts: Record<string, string[]>): void {
  localStorage.setItem(PROMPTS_KEY, JSON.stringify(prompts));
}
