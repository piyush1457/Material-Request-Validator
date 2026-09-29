import type { MaterialBenchmark, AIAnalysis, SeverityLevel, MaterialRequest } from '../types';
import { MATERIAL_BENCHMARKS } from '../data/benchmarks';

function findBenchmark(materialName: string): MaterialBenchmark | undefined {
  const normalizedInput = materialName.toLowerCase().trim();
  return MATERIAL_BENCHMARKS.find(b => 
    b.name.toLowerCase().trim() === normalizedInput ||
    b.id.toLowerCase().trim() === normalizedInput ||
    b.name.toLowerCase().includes(normalizedInput) ||
    normalizedInput.includes(b.name.toLowerCase())
  );
}

function estimateExpectedQuantity(taskName: string, materialName: string): number {
  const taskAreaMap: Record<string, number> = {
    'Flooring': 100,
    'Wall Painting': 250,
    'Ceiling': 100,
    'Wall Construction': 80,
    'Tiling': 120,
    'Plastering': 150,
  };
  
  const area = taskAreaMap[taskName] || 100;
  const benchmark = findBenchmark(materialName);
  
  if (!benchmark) return area * 0.1;
  
  if (benchmark.unit === 'litres') return area * 0.1;
  if (benchmark.unit === 'sq m') return area * 1.0;
  if (benchmark.unit === 'kg') return area * 4.5;
  if (benchmark.unit === 'bags') return area / 10;
  
  return area * 0.1;
}

function calculateSeverity(
  requestedQty: number,
  expectedQty: number,
  materialName: string
): { severity: SeverityLevel; message: string; issue: string; recommendation: string; wasteFactors: string[]; estimatedWaste: string } {
  const variance = ((requestedQty - expectedQty) / expectedQty) * 100;
  const benchmark = findBenchmark(materialName);
  const unit = benchmark?.unit || 'units';
  
  if (variance <= 10) {
    return {
      severity: 'LOW',
      message: 'Within normal range',
      issue: 'No significant issue detected',
      recommendation: 'Proceed with standard procurement',
      wasteFactors: [],
      estimatedWaste: 'Minimal',
    };
  }
  
  if (variance <= 25) {
    return {
      severity: 'MEDIUM',
      message: 'Above expected range - Review recommended',
      issue: `Request is ${variance.toFixed(0)}% above typical consumption for ${materialName}`,
      recommendation: 'Verify site conditions and measurement accuracy before approval',
      wasteFactors: ['Measurement variance', 'Standard wastage'],
      estimatedWaste: `${((requestedQty - expectedQty) * 0.5).toFixed(1)} ${unit} potential excess`,
    };
  }
  
  if (variance <= 50) {
    return {
      severity: 'HIGH',
      message: 'Significantly above range - Action Required',
      issue: `Request exceeds typical consumption by ${variance.toFixed(0)}% for ${materialName}. Likely causes: rework, measurement error, or scope change.`,
      recommendation: 'Require site engineer justification. Check for rework, damaged materials, or design changes.',
      wasteFactors: ['Possible rework', 'Measurement discrepancy', 'Scope creep'],
      estimatedWaste: `${((requestedQty - expectedQty) * 0.7).toFixed(1)} ${unit} potential excess`,
    };
  }
  
  return {
    severity: 'CRITICAL',
    message: 'Critical deviation - Immediate review required',
    issue: `Request is ${variance.toFixed(0)}% above benchmark. High probability of over-ordering or specification error.`,
    recommendation: 'Mandatory site visit verification. Do not procure without project manager approval.',
    wasteFactors: ['Major rework suspected', 'Specification error likely', 'Potential over-ordering'],
    estimatedWaste: `${(requestedQty - expectedQty).toFixed(1)} ${unit} likely waste`,
  };
}

export function analyzeRequest(request: Omit<MaterialRequest, 'id' | 'createdAt' | 'createdBy' | 'status' | 'severity' | 'aiAnalysis'>): AIAnalysis {
  const expectedQty = estimateExpectedQuantity(request.taskName, request.materialName);
  const analysis = calculateSeverity(request.requestedQuantity, expectedQty, request.materialName);
  
  return {
    severity: analysis.severity,
    message: analysis.message,
    issue: analysis.issue,
    recommendation: analysis.recommendation,
    wasteFactors: analysis.wasteFactors,
    estimatedWaste: analysis.estimatedWaste,
  };
}

export function getStatusFromSeverity(severity: string): MaterialRequest['status'] {
  switch (severity) {
    case 'LOW': return 'NORMAL';
    case 'MEDIUM': return 'REVIEW';
    case 'HIGH':
    case 'CRITICAL': return 'FLAG';
    default: return 'NORMAL';
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'LOW': return 'text-green-700 bg-green-100 border-green-300';
    case 'MEDIUM': return 'text-amber-700 bg-amber-100 border-amber-300';
    case 'HIGH': return 'text-orange-700 bg-orange-100 border-orange-300';
    case 'CRITICAL': return 'text-red-700 bg-red-100 border-red-300';
    default: return 'text-green-700 bg-green-100 border-green-300';
  }
}

export function getSeverityLabel(severity: string): string {
  switch (severity) {
    case 'LOW': return 'Normal';
    case 'MEDIUM': return 'Review';
    case 'HIGH': return 'Action Required';
    case 'CRITICAL': return 'Critical';
    default: return 'Normal';
  }
}

export function getActionButtonText(severity: string): string {
  switch (severity) {
    case 'LOW': return 'View Details';
    case 'MEDIUM': return 'Review Required';
    case 'HIGH': return 'Action Required';
    case 'CRITICAL': return 'Urgent Review';
    default: return 'View Details';
  }
}