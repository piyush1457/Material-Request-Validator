import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, Building2, FileText } from 'lucide-react';
import { useProjects } from '../hooks';
import { Button, Modal, EmptyState } from '../components';
import type { Project, Task } from '../types';

const inputClasses = 'w-full px-4 py-3 bg-deep-coal border border-graphite rounded-[8px] text-white placeholder:text-fog focus:outline-none focus:ring-2 focus:ring-blue-cornflower focus:border-blue-cornflower transition-colors';
const selectClasses = 'w-full px-4 py-3 bg-deep-coal border border-graphite rounded-[8px] text-white focus:outline-none focus:ring-2 focus:ring-blue-cornflower focus:border-blue-cornflower transition-colors';
const labelClasses = 'block text-body-sm text-ash mb-2';

export function Projects() {
  const navigate = useNavigate();
  const { projects, loading, createProject, editProject, removeProject } = useProjects();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tasks: [{ name: '', metricLabel: '', metricValue: '', metricUnit: '' }] as { name: string; metricLabel: string; metricValue: string; metricUnit: string }[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const tasks: Task[] = formData.tasks
      .filter(t => t.name.trim())
      .map((t, i) => ({
        id: `task-${Date.now()}-${i}`,
        name: t.name.trim(),
        projectId: editingProject?.id || `project-${Date.now()}`,
        metric: t.metricLabel && t.metricValue
          ? {
              label: t.metricLabel,
              value: parseFloat(t.metricValue) || 0,
              unit: t.metricUnit || undefined,
            }
          : undefined,
      }));

    const project: Project = {
      id: editingProject?.id || `project-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim(),
      tasks,
      createdAt: editingProject?.createdAt || new Date().toISOString(),
    };

    if (editingProject) {
      editProject(project);
    } else {
      createProject(project);
    }
    closeModal();
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({ name: '', description: '', tasks: [{ name: '', metricLabel: '', metricValue: '', metricUnit: '' }] });
    setShowModal(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      tasks: project.tasks.map(t => ({
        name: t.name,
        metricLabel: t.metric?.label || '',
        metricValue: t.metric?.value?.toString() || '',
        metricUnit: t.metric?.unit || '',
      })),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormData({ name: '', description: '', tasks: [{ name: '', metricLabel: '', metricValue: '', metricUnit: '' }] });
  };

  const addTaskRow = () => {
    setFormData(prev => ({ ...prev, tasks: [...prev.tasks, { name: '', metricLabel: '', metricValue: '', metricUnit: '' }] }));
  };

  const removeTaskRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index),
    }));
  };

  const toggleExpand = (projectId: string) => {
    setExpandedProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleCreateRequest = (projectId: string, taskId: string) => {
    navigate('/requests', { state: { projectId, taskId } });
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-cornflower" />
      </div>
    );
  }

  return (
    <div className="flex-1 grid-wireframe min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-caption text-ash mb-2">PROJECTS</p>
            <h1 className="text-display font-semibold text-white tracking-[-2.3px]">Projects</h1>
            <p className="text-body text-ash mt-2">Manage retail fit-out projects and tasks</p>
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            icon={<Building2 className="h-12 w-12 text-ash/50" />}
            title="No projects yet"
            description="Create your first project to start tracking material requests."
            action={{ label: 'Create Project', onClick: openCreateModal }}
          />
        ) : (
          <div className="space-y-4">
            {projects.map((project) => {
              const isExpanded = expandedProjects.includes(project.id);
              return (
                <div key={project.id} className="bg-card-carbon border border-steel-border rounded-[8px] overflow-hidden">
                  <div className="p-6 border-b border-steel-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleExpand(project.id)}
                          className="p-1 rounded-[8px] text-ash hover:text-white hover:bg-white/5 transition-colors"
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </button>
                        <Building2 className="h-6 w-6 text-blue-cornflower" />
                        <div>
                          <h3 className="text-subheading font-semibold text-white">{project.name}</h3>
                          <p className="text-body-sm text-ash">{project.tasks.length} task{project.tasks.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={() => navigate('/requests', { state: { projectId: project.id } })}>
                          New Request
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(project)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeProject(project.id)}>
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-6 space-y-3 border-t border-steel-border">
                      {project.tasks.map((task) => (
                        <div key={task.id} className="bg-deep-coal/50 rounded-[8px] p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-cornflower/10 rounded-[8px]">
                              <FileText className="h-5 w-5 text-blue-cornflower" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{task.name}</p>
                              {task.metric && (
                                <p className="text-body-sm text-ash">
                                  {task.metric.label}: {task.metric.value} {task.metric.unit || ''}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => handleCreateRequest(project.id, task.id)}
                          >
                            Request Material
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={closeModal} title={editingProject ? 'Edit Project' : 'Create Project'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="project-name" className={labelClasses}>
              Project Name <span className="text-danger">*</span>
            </label>
            <input
              id="project-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Reliance Retail — Indiranagar"
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label htmlFor="project-description" className={labelClasses}>
              Description
            </label>
            <textarea
              id="project-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              placeholder="Optional description"
              className={inputClasses}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-body-sm font-medium text-ash">Tasks</h4>
              <Button variant="secondary" size="sm" type="button" onClick={addTaskRow}>
                <Plus className="h-4 w-4" /> Add Task
              </Button>
            </div>
            {formData.tasks.map((task, index) => (
              <div key={index} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={task.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      tasks: prev.tasks.map((t, i) => i === index ? { ...t, name: e.target.value } : t)
                    }))}
                    placeholder="Task name (e.g., Flooring, Painting, Tiling)"
                    className={inputClasses + ' flex-1'}
                    required
                  />
                  {formData.tasks.length > 1 && (
                    <Button variant="ghost" size="sm" type="button" onClick={() => removeTaskRow(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 pl-10">
                  <input
                    type="text"
                    value={task.metricLabel}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      tasks: prev.tasks.map((t, i) => i === index ? { ...t, metricLabel: e.target.value } : t)
                    }))}
                    placeholder="Metric label (e.g., Walls, Rooms)"
                    className={inputClasses + ' text-sm'}
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={task.metricValue}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      tasks: prev.tasks.map((t, i) => i === index ? { ...t, metricValue: e.target.value } : t)
                    }))}
                    placeholder="Value"
                    className={inputClasses + ' text-sm'}
                  />
                  <input
                    type="text"
                    value={task.metricUnit}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      tasks: prev.tasks.map((t, i) => i === index ? { ...t, metricUnit: e.target.value } : t)
                    }))}
                    placeholder="Unit (e.g., count, m)"
                    className={inputClasses + ' text-sm'}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t border-steel-border">
            <Button variant="secondary" type="button" onClick={closeModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingProject ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}