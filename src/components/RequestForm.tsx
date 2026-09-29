import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project, Task } from '../types';
import { MATERIAL_BENCHMARKS } from '../data/benchmarks';
import { analyzeRequest, getStatusFromSeverity, getSeverityColor, getSeverityLabel } from '../utils/aiValidation';
import { useProjects, useRequests } from '../hooks';
import { Button } from './Button';
import { StatusBadge } from './StatusBadge';

interface RequestFormProps {
  initialData?: {
    projectId?: string;
    taskId?: string;
  };
}

export function RequestForm({ initialData }: RequestFormProps) {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { createRequest } = useRequests();
  
  const [projectId, setProjectId] = useState(initialData?.projectId || '');
  const [taskId, setTaskId] = useState(initialData?.taskId || '');
  const [customTask, setCustomTask] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeRequest> | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedProject = projects.find(p => p.id === projectId);
  const selectedTask = selectedProject?.tasks.find(t => t.id === taskId);
  const taskName = selectedTask?.name || customTask;
  
  const matchedBenchmark = MATERIAL_BENCHMARKS.find(m => 
    m.name.toLowerCase() === materialName.toLowerCase()
  );
  const suggestedUnit = matchedBenchmark?.unit || 'kg';

  useEffect(() => {
    if (initialData?.projectId) setProjectId(initialData.projectId);
    if (initialData?.taskId) setTaskId(initialData.taskId);
  }, [initialData]);

  useEffect(() => {
    if (projectId && !selectedProject) {
      setProjectId('');
      setTaskId('');
      setCustomTask('');
    }
  }, [projectId, selectedProject]);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    if (!projectId) {
      alert('Please select a project');
      return;
    }
    if (!taskName.trim()) {
      alert('Please select or enter a task');
      return;
    }
    if (!materialName.trim()) {
      alert('Please enter a material name');
      return;
    }
    
    const result = analyzeRequest({
      projectId,
      projectName: selectedProject?.name || '',
      taskId: taskId || 'custom',
      taskName,
      materialId: materialName.toLowerCase().replace(/\s+/g, '-'),
      materialName,
      requestedQuantity: qty,
      unit: unit || suggestedUnit,
    });
    
    setAnalysis(result);
    setShowPreview(true);
  };

  const handleSubmit = () => {
    if (!analysis || !selectedProject || !taskName.trim() || !materialName.trim()) return;
    
    const newRequest = {
      id: `req-${Date.now()}`,
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      taskId: taskId || 'custom',
      taskName,
      materialId: materialName.toLowerCase().replace(/\s+/g, '-'),
      materialName,
      requestedQuantity: parseFloat(quantity),
      unit: unit || suggestedUnit,
      status: getStatusFromSeverity(analysis.severity),
      severity: analysis.severity,
      aiAnalysis: analysis,
      createdAt: new Date().toISOString(),
      createdBy: 'Site Engineer',
    };

    createRequest(newRequest);
    navigate('/recent', { state: { request: newRequest, analysis } });
    setSubmitted(true);
  };

  const resetForm = () => {
    setQuantity('');
    setMaterialName('');
    setUnit('kg');
    setCustomTask('');
    setAnalysis(null);
    setShowPreview(false);
    setSubmitted(false);
  };

  const inputClasses = 'w-full px-4 py-3 bg-deep-coal border border-graphite rounded-[8px] text-white placeholder:text-fog focus:outline-none focus:ring-2 focus:ring-blue-cornflower focus:border-blue-cornflower transition-colors';
  const labelClasses = 'block text-body-sm text-ash mb-2';
  const selectClasses = 'w-full px-4 py-3 bg-deep-coal border border-graphite rounded-[8px] text-white focus:outline-none focus:ring-2 focus:ring-blue-cornflower focus:border-blue-cornflower transition-colors';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <p className="text-caption text-ash mb-2">MATERIAL REQUEST</p>
        <h2 className="text-heading font-semibold text-white tracking-[-0.84px]">Create Material Request</h2>
        <p className="text-body text-ash mt-2">Enter material details for validation</p>
      </div>

      <form onSubmit={handleValidate} className="space-y-6" noValidate>
        <div>
          <label htmlFor="project" className={labelClasses}>
            Project / Store <span className="text-danger">*</span>
          </label>
          <select
            id="project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className={selectClasses}
            required
          >
            <option value="">Select a project</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>
            Task <span className="text-danger">*</span>
          </label>
          <div className="space-y-3">
            <select
              value={taskId}
              onChange={(e) => {
                setTaskId(e.target.value);
                setCustomTask('');
              }}
              disabled={!selectedProject}
              className={selectClasses + ' disabled:opacity-50 disabled:cursor-not-allowed'}
            >
              <option value="">Select a task</option>
              {selectedProject?.tasks.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
              <option value="custom">+ Add custom task...</option>
            </select>
            {taskId === 'custom' && (
              <input
                type="text"
                value={customTask}
                onChange={(e) => setCustomTask(e.target.value)}
                placeholder="Enter custom task name (e.g., Waterproofing)"
                className={inputClasses}
                required
              />
            )}
          </div>
        </div>

        <div>
          <label htmlFor="material" className={labelClasses}>
            Material Name <span className="text-danger">*</span>
          </label>
          <input
            id="material"
            type="text"
            value={materialName}
            onChange={(e) => setMaterialName(e.target.value)}
            placeholder="e.g., Tile Adhesive, Paint, Cement, Custom Material..."
            className={inputClasses}
            required
            list="material-suggestions"
          />
          <datalist id="material-suggestions">
            {MATERIAL_BENCHMARKS.map(m => (
              <option key={m.id} value={m.name} />
            ))}
          </datalist>
          <p className="text-caption text-fog mt-2">Type freely or select from suggestions</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="quantity" className={labelClasses}>
              Quantity <span className="text-danger">*</span>
            </label>
            <input
              id="quantity"
              type="number"
              step="0.1"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label htmlFor="unit" className={labelClasses}>
              Unit
            </label>
            <input
              id="unit"
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g., kg, litres, bags, sq m"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" size="lg" className="flex-1">
            Validate
          </Button>
          <Button type="button" variant="secondary" onClick={resetForm}>
            Clear
          </Button>
        </div>
      </form>

      {showPreview && analysis && (
        <div className="bg-card-carbon border border-steel-border rounded-[8px] p-6">
          <p className="text-caption text-ash mb-4">AI VALIDATION RESULT</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-body-sm text-ash mb-1">Material</p>
              <p className="text-subheading font-semibold text-white">{materialName}</p>
            </div>
            <div>
              <p className="text-body-sm text-ash mb-1">Quantity</p>
              <p className="text-subheading font-semibold text-white">{quantity} {unit}</p>
            </div>
            <div>
              <p className="text-body-sm text-ash mb-1">Task</p>
              <p className="text-subheading font-semibold text-white">{taskName}</p>
            </div>
            <div>
              <p className="text-body-sm text-ash mb-1">Project</p>
              <p className="text-subheading font-semibold text-white">{selectedProject?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <StatusBadge severity={analysis.severity} size="md" />
            <span className={`px-3 py-1 rounded-[8px] text-body-sm font-medium ${getSeverityColor(analysis.severity)}`}>
              {getSeverityLabel(analysis.severity)}
            </span>
          </div>
          <p className="text-body text-ash mb-6">{analysis.message}</p>
          
          <div className="flex gap-3 pt-4 border-t border-steel-border">
            <Button variant="secondary" onClick={() => setShowPreview(false)} className="flex-1">
              Back
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Submit Request
            </Button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="text-center py-4">
          <Button variant="secondary" onClick={resetForm}>
            Create Another Request
          </Button>
        </div>
      )}
    </div>
  );
}

const labelClasses = 'block text-body-sm text-ash mb-2';
const inputClasses = 'w-full px-4 py-3 bg-deep-coal border border-graphite rounded-[8px] text-white placeholder:text-fog focus:outline-none focus:ring-2 focus:ring-blue-cornflower focus:border-blue-cornflower transition-colors';
const selectClasses = 'w-full px-4 py-3 bg-deep-coal border border-graphite rounded-[8px] text-white focus:outline-none focus:ring-2 focus:ring-blue-cornflower focus:border-blue-cornflower transition-colors';