import type { Project, MaterialRequest } from '../types';
import { DEMO_PROJECTS } from '../data/demoData';
import { DEMO_REQUESTS } from '../data/demoData';

const STORAGE_KEYS = {
  PROJECTS: 'mr_projects',
  REQUESTS: 'mr_requests',
  INITIALIZED: 'mr_initialized',
} as const;

function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item) as T;
    }
  } catch (e) {
    console.warn(`Failed to parse localStorage key "${key}":`, e);
  }
  return fallback;
}

function safeSetItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to set localStorage key "${key}":`, e);
  }
}

export function initializeDemoData(): void {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!initialized) {
    safeSetItem(STORAGE_KEYS.PROJECTS, DEMO_PROJECTS);
    safeSetItem(STORAGE_KEYS.REQUESTS, DEMO_REQUESTS);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

export function resetDemoData(): void {
  safeSetItem(STORAGE_KEYS.PROJECTS, DEMO_PROJECTS);
  safeSetItem(STORAGE_KEYS.REQUESTS, DEMO_REQUESTS);
}

export function getProjects(): Project[] {
  return safeGetItem<Project[]>(STORAGE_KEYS.PROJECTS, []);
}

export function saveProjects(projects: Project[]): void {
  safeSetItem(STORAGE_KEYS.PROJECTS, projects);
}

export function getProject(id: string): Project | undefined {
  const projects = getProjects();
  return projects.find(p => p.id === id);
}

export function addProject(project: Project): void {
  const projects = getProjects();
  projects.push(project);
  saveProjects(projects);
}

export function updateProject(updatedProject: Project): void {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === updatedProject.id);
  if (index !== -1) {
    projects[index] = updatedProject;
    saveProjects(projects);
  }
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter(p => p.id !== id);
  saveProjects(projects);
}

export function getRequests(): MaterialRequest[] {
  return safeGetItem<MaterialRequest[]>(STORAGE_KEYS.REQUESTS, []);
}

export function saveRequests(requests: MaterialRequest[]): void {
  safeSetItem(STORAGE_KEYS.REQUESTS, requests);
}

export function addRequest(request: MaterialRequest): void {
  const requests = getRequests();
  requests.unshift(request);
  saveRequests(requests);
}

export function getRequestsByProject(projectId: string): MaterialRequest[] {
  return getRequests().filter(r => r.projectId === projectId);
}

export function getRecentRequests(limit: number = 10): MaterialRequest[] {
  return getRequests().slice(0, limit);
}

export function getRequestsByStatus(status: MaterialRequest['status']): MaterialRequest[] {
  return getRequests().filter(r => r.status === status);
}