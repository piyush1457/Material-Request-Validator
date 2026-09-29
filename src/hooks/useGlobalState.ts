import { useState, useEffect, useCallback } from 'react';
import type { Project, MaterialRequest } from '../types';
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getProject,
  getRequests,
  addRequest,
  getRecentRequests,
  getRequestsByStatus,
  initializeDemoData,
} from '../utils/storage';

const projectListeners: Set<() => void> = new Set();
const requestListeners: Set<() => void> = new Set();

function notifyProjectsChange() {
  projectListeners.forEach(fn => fn());
}

function notifyRequestsChange() {
  requestListeners.forEach(fn => fn());
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeDemoData();
    const stored = getProjects();
    setProjects(stored);
    setLoading(false);
    const fn = () => setProjects(getProjects());
    projectListeners.add(fn);
    return () => { projectListeners.delete(fn); };
  }, []);

  const createProject = useCallback((project: Project) => {
    addProject(project);
    notifyProjectsChange();
  }, []);

  const editProject = useCallback((project: Project) => {
    updateProject(project);
    notifyProjectsChange();
  }, []);

  const removeProject = useCallback((id: string) => {
    deleteProject(id);
    notifyProjectsChange();
  }, []);

  const getProjectById = useCallback((id: string) => {
    return getProject(id);
  }, []);

  return {
    projects,
    loading,
    createProject,
    editProject,
    removeProject,
    getProjectById,
  };
}

export function useRequests() {
  const [requests, setRequests] = useState<MaterialRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeDemoData();
    const stored = getRequests();
    setRequests(stored);
    setLoading(false);
    const fn = () => setRequests(getRequests());
    requestListeners.add(fn);
    return () => { requestListeners.delete(fn); };
  }, []);

  const createRequest = useCallback((request: MaterialRequest) => {
    addRequest(request);
    notifyRequestsChange();
  }, []);

  const getRecent = useCallback((limit?: number) => {
    return getRecentRequests(limit);
  }, []);

  const getByStatus = useCallback((status: MaterialRequest['status']) => {
    return getRequestsByStatus(status);
  }, []);

  const refresh = useCallback(() => {
    setRequests(getRequests());
  }, []);

  return {
    requests,
    loading,
    createRequest,
    getRecent,
    getByStatus,
    refresh,
  };
}