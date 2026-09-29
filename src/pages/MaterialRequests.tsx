import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { RequestForm } from '../components';
import type { Project } from '../types';
import { useProjects } from '../hooks';

export function MaterialRequests() {
  const location = useLocation();
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');

  const selectClasses = 'w-full px-3 py-2 bg-deep-coal border border-graphite rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-cornflower focus:border-blue-cornflower transition-colors';
  const disabledSelectClasses = ' disabled:bg-deep-coal disabled:text-fog disabled:cursor-not-allowed';

  const state = location.state as { projectId?: string; taskId?: string } | undefined;

  const projectForTasks = selectedProjectId 
    ? projects.find(p => p.id === selectedProjectId)
    : state?.projectId 
      ? projects.find(p => p.id === state.projectId)
      : undefined;

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Material Request</h1>
          <p className="text-text-muted">Create a new material request and validate against benchmarks</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 mb-6">
          <h3 className="text-lg font-semibold text-text mb-4">Quick Select</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Project</label>
              <select
                value={selectedProjectId || (state?.projectId || '')}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  setSelectedTaskId('');
                }}
                className={selectClasses}
              >
                <option value="">Select a project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Task</label>
              <select
                value={selectedTaskId || (state?.taskId || '')}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                disabled={!projectForTasks}
                className={selectClasses + disabledSelectClasses}
              >
                <option value="">Select a task</option>
                {projectForTasks?.tasks.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <RequestForm 
          initialData={{
            projectId: selectedProjectId || state?.projectId,
            taskId: selectedTaskId || state?.taskId,
          }}
        />
      </div>
    </div>
  );
}