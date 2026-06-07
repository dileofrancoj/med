export interface ValidationAlert {
  type: 'danger' | 'warning' | 'info';
  parameter: string;
  message: string;
}

export interface CalculationStep {
  name: string;
  formula: string;
  development: string;
  result: string;
}

export interface MedicalOrder {
  solutionVolumeMl: number;
  electrolyteVolumeMl: number;
  totalVolumeMl: number;
  infusionRateMlPerHour: number;
  durationHours: number;
  instructionText: string;
}
