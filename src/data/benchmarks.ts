import type { MaterialBenchmark } from '../types';

export const MATERIAL_BENCHMARKS: MaterialBenchmark[] = [
  {
    id: 'paint',
    name: 'Paint',
    unit: 'litres',
    typicalRate: '0.1 L per sq m per coat',
    wastageMargin: 0.10,
  },
  {
    id: 'tiles',
    name: 'Tiles',
    unit: 'sq m',
    typicalRate: '1.0 sq m per sq m',
    wastageMargin: 0.08,
  },
  {
    id: 'adhesive',
    name: 'Tile Adhesive',
    unit: 'kg',
    typicalRate: '4.5 kg per sq m',
    wastageMargin: 0.10,
  },
  {
    id: 'plaster',
    name: 'Plaster',
    unit: 'bags',
    typicalRate: '1 bag per 10 sq m',
    wastageMargin: 0.15,
  },
  {
    id: 'cement',
    name: 'Cement',
    unit: 'bags',
    typicalRate: '1 bag per 5 sq m',
    wastageMargin: 0.10,
  },
];

export const DEFAULT_TASKS = [
  'Flooring',
  'Wall Painting',
  'Ceiling',
  'Wall Construction',
  'Tiling',
  'Plastering',
];

export const EXCEPTION_REASONS = [
  { value: 'REWORK', label: 'Rework' },
  { value: 'DAMAGED_MATERIAL', label: 'Damaged material' },
  { value: 'ADDITIONAL_SCOPE', label: 'Additional scope' },
  { value: 'MEASUREMENT_ADJUSTMENT', label: 'Measurement adjustment' },
  { value: 'OTHER', label: 'Other' },
] as const;

export const DEMO_NOTE = "Demo benchmark rates are illustrative. Production values would be based on company-approved standards or historical project data.";