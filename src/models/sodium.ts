import { Patient } from './patient';
import { ValidationAlert, CalculationStep, MedicalOrder } from './common';

export type HyponatremiaSeverity = 'normal' | 'leve' | 'moderada' | 'severa';

export interface SodiumClassification {
  status: 'normal' | 'hiponatremia' | 'hipernatremia' | 'normal';
  severity: HyponatremiaSeverity;
  naLevel: number;
}

export interface RapidSodiumCorrectionRequest {
  patient: Patient;
  doseMlKg?: number; // Standard is 4 to 6 ml/kg of NaCl 3%. Default to 4.
}

export interface RapidSodiumCorrectionResponse {
  patient: Patient;
  bolusVolumeMl: number;
  maxDoseLimitMl: number;
  mEqDelivered: number;
  steps: CalculationStep[];
  alerts: ValidationAlert[];
  medicalOrder: MedicalOrder;
}

export interface SlowSodiumCorrectionRequest {
  patient: Patient;
  naCurrent: number;
  naTarget: number;
  bodyWaterFactor?: number; // Default to 0.6 for pediatric ACT
}

export interface SlowSodiumCorrectionResponse {
  patient: Patient;
  naDeficitMEq: number;
  mlNaCl20: number; // Volume if using 20% NaCl ampoules
  mlNaCl3: number; // Volume if using 3% NaCl solution
  steps: CalculationStep[];
  alerts: ValidationAlert[];
}
