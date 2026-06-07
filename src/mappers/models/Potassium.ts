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
}

export interface RapidCorrectionResponseDto {
  classification?: {
    status: string;
    severity: string;
    value: number;
  };
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
    weight: string | number;
    weightKg?: string | number;
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
