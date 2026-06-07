import { SEVERITY_LEVEL } from '../constants/potassium';
import {
  HyperkalemiaSeverity,
  HypokalemiaSeverity,
  PotassiumClassification,
} from '../models/potassium';

export const isInvalidPotassiumInfusionTimeHours = (hours: number): boolean => {
  if (hours !== 2 && hours !== 3) {
    return true;
  }
  return false;
};

export const isInvalidPotassiumDose = (dose: number): boolean => {
  if (dose !== 0.5 && dose !== 1.0) {
    return true;
  }
  return false;
};

export const classifyPotassium = (kLevel: number): PotassiumClassification => {
  if (kLevel < 3.5) {
    let severity: HypokalemiaSeverity;
    if (kLevel >= 3.0) severity = SEVERITY_LEVEL.LEVE;
    else if (kLevel >= 2.5) severity = SEVERITY_LEVEL.MODERATE;
    else if (kLevel >= 2.0) severity = SEVERITY_LEVEL.SEVERE;
    else severity = 'critica';

    return { status: 'hipokalemia', severity, kLevel };
  } else if (kLevel > 5.0) {
    let severity: HyperkalemiaSeverity;
    if (kLevel <= 5.9) severity = SEVERITY_LEVEL.LEVE;
    else if (kLevel <= 6.4) severity = SEVERITY_LEVEL.MODERATE;
    else severity = SEVERITY_LEVEL.SEVERE;

    return { status: 'hiperkalemia', severity, kLevel };
  }

  return { status: 'normal', severity: 'normal', kLevel };
};
