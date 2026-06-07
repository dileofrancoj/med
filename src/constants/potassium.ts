import { HyperkalemiaSeverity } from '../models/potassium';

export const SEVERITY_LEVEL: Record<
  'LEVE' | 'MODERATE' | 'SEVERE' | 'NORMAL',
  HyperkalemiaSeverity
> = {
  NORMAL: 'normal',
  LEVE: 'leve',
  MODERATE: 'moderada',
  SEVERE: 'severa',
};
