import { Patient } from './patient';
import { ValidationAlert, CalculationStep, MedicalOrder } from './common';

export type HypokalemiaSeverity = 'normal' | 'leve' | 'moderada' | 'severa' | 'critica';
export type HyperkalemiaSeverity = 'normal' | 'leve' | 'moderada' | 'severa';

export interface PotassiumClassification {
  status: 'normal' | 'hipokalemia' | 'hiperkalemia';
  severity: HypokalemiaSeverity | HyperkalemiaSeverity;
  kLevel: number;
}

export interface RapidPotassiumCorrectionRequest {
  patient: Patient;
  doseMEqKg: 0.5 | 1.0;
  infusionTimeHours: 2 | 3;
  customDilutionFluidVolumeMl?: number; // Optional custom volume to validate
  selectedConcentrationMEqL: number;
  classification?: PotassiumClassification;
}

export interface RapidPotassiumCorrectionResponse {
  patient: Patient;
  classification?: PotassiumClassification;
  mEqRequired: number;
  mlClK: number;
  dilutionFluidVolumeMl: number; // Suggested minimum or validated volume
  totalVolumeMl: number;
  infusionRateMlPerHour: number;
  flowMEqKgH: number;
  steps: CalculationStep[];
  alerts: ValidationAlert[];
  medicalOrder: MedicalOrder;
}

export interface PotassiumMaintenanceRequest {
  patient: Patient;
  dailyRequirementMEqKg: number; // e.g., 2 to 4 mEq/kg/day
}

export interface PotassiumMaintenanceResponse {
  patient: Patient;
  mEqRequired: number;
  mlClK: number;
  dailyContributionMEq: number;
  steps: CalculationStep[];
}
