import type { Project, Task, MaterialRequest, AIAnalysis, SeverityLevel } from '../types';
import { analyzeRequest, getStatusFromSeverity } from '../utils/aiValidation';

const createRequest = (overrides: Partial<MaterialRequest>): MaterialRequest => {
  const base = {
    projectId: 'project-1',
    projectName: 'Reliance Retail — Indiranagar',
    taskId: 'task-1',
    taskName: 'Flooring',
    materialId: 'adhesive',
    materialName: 'Tile Adhesive',
    requestedQuantity: 500,
    unit: 'kg',
    reason: undefined,
    customReason: undefined,
    ...overrides,
  };
  
  const aiAnalysis = analyzeRequest(base);
  return {
    id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: getStatusFromSeverity(aiAnalysis.severity),
    severity: aiAnalysis.severity,
    aiAnalysis,
    createdAt: new Date().toISOString(),
    createdBy: 'Site Engineer',
    ...base,
  };
};

export const DEMO_PROJECTS: Project[] = [
  {
    id: 'project-1',
    name: 'Reliance Retail - Indiranagar',
    description: 'Retail fit-out for Indiranagar location',
    tasks: [
      { id: 'task-1', name: 'Flooring', projectId: 'project-1', metric: { label: 'Area', value: 120, unit: 'sq m' } },
      { id: 'task-2', name: 'Wall Painting', projectId: 'project-1', metric: { label: 'Walls', value: 12, unit: 'count' } },
      { id: 'task-3', name: 'Ceiling', projectId: 'project-1', metric: { label: 'Area', value: 120, unit: 'sq m' } },
      { id: 'task-4', name: 'Tiling', projectId: 'project-1', metric: { label: 'Area', value: 80, unit: 'sq m' } },
    ],
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'project-2',
    name: 'Retail Store - Koramangala',
    description: 'New retail store fit-out',
    tasks: [
      { id: 'task-5', name: 'Flooring', projectId: 'project-2', metric: { label: 'Area', value: 85, unit: 'sq m' } },
      { id: 'task-6', name: 'Wall Painting', projectId: 'project-2', metric: { label: 'Walls', value: 8, unit: 'count' } },
      { id: 'task-7', name: 'Plastering', projectId: 'project-2', metric: { label: 'Area', value: 150, unit: 'sq m' } },
    ],
    createdAt: '2024-02-20T10:00:00Z',
  },
];

const baseRequests = [
  { taskName: 'Flooring', materialName: 'Tile Adhesive', requestedQuantity: 480, unit: 'kg', projectId: 'project-1', projectName: 'Reliance Retail - Indiranagar', taskId: 'task-1' },
  { taskName: 'Flooring', materialName: 'Tiles', requestedQuantity: 105, unit: 'sq m', projectId: 'project-1', projectName: 'Reliance Retail - Indiranagar', taskId: 'task-1' },
  { taskName: 'Wall Painting', materialName: 'Paint', requestedQuantity: 28, unit: 'litres', projectId: 'project-1', projectName: 'Reliance Retail - Indiranagar', taskId: 'task-2', reason: 'MEASUREMENT_ADJUSTMENT' as const },
  { taskName: 'Ceiling', materialName: 'Plaster', requestedQuantity: 18, unit: 'bags', projectId: 'project-1', projectName: 'Reliance Retail - Indiranagar', taskId: 'task-3', reason: 'REWORK' as const },
  { taskName: 'Tiling', materialName: 'Cement', requestedQuantity: 15, unit: 'bags', projectId: 'project-1', projectName: 'Reliance Retail - Indiranagar', taskId: 'task-4' },
  { taskName: 'Flooring', materialName: 'Tile Adhesive', requestedQuantity: 350, unit: 'kg', projectId: 'project-2', projectName: 'Retail Store - Koramangala', taskId: 'task-5' },
  { taskName: 'Wall Painting', materialName: 'Paint', requestedQuantity: 35, unit: 'litres', projectId: 'project-2', projectName: 'Retail Store - Koramangala', taskId: 'task-6', reason: 'ADDITIONAL_SCOPE' as const },
  { taskName: 'Plastering', materialName: 'Plaster', requestedQuantity: 25, unit: 'bags', projectId: 'project-2', projectName: 'Retail Store - Koramangala', taskId: 'task-7', reason: 'DAMAGED_MATERIAL' as const },
  { taskName: 'Flooring', materialName: 'Tiles', requestedQuantity: 200, unit: 'sq m', projectId: 'project-2', projectName: 'Retail Store - Koramangala', taskId: 'task-5', reason: 'REWORK' as const },
  { taskName: 'Wall Painting', materialName: 'Paint', requestedQuantity: 15, unit: 'litres', projectId: 'project-2', projectName: 'Retail Store - Koramangala', taskId: 'task-6' },
];

export const DEMO_REQUESTS: MaterialRequest[] = baseRequests.map((r, i) => {
  const req = createRequest(r);
  // Adjust dates to be spread out
  const date = new Date('2024-03-01');
  date.setDate(date.getDate() + i);
  return { ...req, createdAt: date.toISOString() };
});