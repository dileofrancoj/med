import { ValidationAlert } from '../../models/common';
import { SEX } from '../../models/patient';
import { PotassiumClassification } from '../../models/potassium';

export interface RapidCorrectionRequestDto {
  patient: {
    weight: number;
    age?: number;
    sex?: SEX;
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
  patient: {
    weight: number;
    age?: number;
    sex?: SEX;
  };
  dailyRequirementMEqKg: string | number;
}

export interface PotassiumMaintenanceResponseDto {
  mEqRequired: number;
  mlClK: number;
  dailyContributionMEq: number;
}
