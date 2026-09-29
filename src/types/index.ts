export interface Project {
  id: string;
  name: string;
  description?: string;
  tasks: Task[];
  createdAt: string;
}

export interface Task {
  id: string;
  name: string;
  projectId: string;
  metric?: TaskMetric;
}

export interface TaskMetric {
  label: string;      // e.g., "Walls", "Rooms", "Length"
  value: number;      // e.g., 4, 10, 50
  unit?: string;      // e.g., "count", "m", "sq m"
}

export interface MaterialBenchmark {
  id: string;
  name: string;
  unit: string;
  typicalRate?: string; // e.g., "4.5 kg per sq m"
  wastageMargin?: number;
}

export interface MaterialRequest {
  id: string;
  projectId: string;
  projectName: string;
  taskId: string;
  taskName: string;
  materialId: string;
  materialName: string;
  requestedQuantity: number;
  unit: string;
  status: RequestStatus;
  severity: SeverityLevel;
  aiAnalysis?: AIAnalysis;
  reason?: ExceptionReason;
  customReason?: string;
  createdAt: string;
  createdBy: string;
}

export type RequestStatus = 'NORMAL' | 'REVIEW' | 'FLAG';
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ExceptionReason = 
  | 'REWORK' 
  | 'DAMAGED_MATERIAL' 
  | 'ADDITIONAL_SCOPE' 
  | 'MEASUREMENT_ADJUSTMENT' 
  | 'OTHER';

export interface AIAnalysis {
  severity: SeverityLevel;
  message: string;
  issue?: string;
  recommendation?: string;
  wasteFactors?: string[];
  estimatedWaste?: string;
}

export interface DashboardKPIs {
  totalRequests: number;
  normal: number;
  review: number;
  flagged: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}