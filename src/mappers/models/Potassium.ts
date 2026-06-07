import { PotassiumClassification } from "../../models/potassium";

export interface RapidCorrectionRequestDto {
  patient: {
    weight: number;
    age?: number;
    sex?: 'male' | 'female';
    accessType: 'peripheral' | 'central';
  };
  doseMEqKg: string | number;
  infusionTimeHours: string | number;
  customDilutionFluidVolumeMl?: string | number;
  selectedConcentrationMEqL?: string | number;
  classification?: PotassiumClassification
}

export interface RapidCorrectionResponseDto {
  classification?: PotassiumClassification
  mEqRequired: number;
  mlClK: number;
  dilutionFluidVolumeMl: number;
  totalVolumeMl: number;
  infusionRateMlPerHour: number;
  flowMEqKgH: number;
  instructionText: string;
}

// Interfaces for Maintenance DTOs
export interface PotassiumMaintenanceRequestDto {
  patient: {
    weight: number;
    age?: string | number;
    sex?: 'male' | 'female';
  };
  dailyRequirementMEqKg: string | number;
}

export interface PotassiumMaintenanceResponseDto {
  mEqRequired: number;
  mlClK: number;
  dailyContributionMEq: number;
}
