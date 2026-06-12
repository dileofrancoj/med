import { ValidationAlert } from '../../models/common';
import { PotassiumClassification } from '../../models/potassium';

export interface RapidCorrectionRequestDto {
  useCase: 'rapid';
  patient: {
    weight: number;
    accessType: 'peripheral' | 'central';
  };
  doseMEqKg: string | number;
  infusionTimeHours: string | number;
  customDilutionFluidVolumeMl?: string | number;
  selectedConcentrationMEqL?: string | number;
  classification?: PotassiumClassification;
}

export interface RapidCorrectionResponseDto {
  classification?: PotassiumClassification;
  mEqRequired: number;
  mlClK: number;
  dilutionFluidVolumeMl: number;
  totalVolumeMl: number;
  infusionRateMlPerHour: number;
  flowMEqKgH: number;
  instructionText: string;
  alerts?: ValidationAlert[];
}

// Interfaces for Maintenance DTOs
export interface PotassiumMaintenanceRequestDto {
  useCase: 'maintenance';
  patient: {
    weight: number;
    accessType?: 'central' | 'peripheral';
  };
  dailyRequirementMEqKg: string | number;
  infusionTimeHours?: string | number;
  selectedConcentrationMEqL?: string | number;
  customDilutionFluidVolumeMl?: number;
}

export interface PotassiumMaintenanceResponseDto {
  mEqRequired: number;
  mlClK: number;
  dailyContributionMEq: number;
  dilutionFluidVolumeMl: number;
  totalVolumeMl: number;
  infusionRateMlPerHour: number;
  instructionText?: string;
  alerts?: ValidationAlert[];
}

export type PotassiumCalculateRequestDto =
  | RapidCorrectionRequestDto
  | PotassiumMaintenanceRequestDto;
