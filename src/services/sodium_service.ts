import { CLINICAL_CONSTANTS, ClinicalConstants } from '../constants/clinical';
import { ValidationAlert, CalculationStep, MedicalOrder } from '../models/common';
import {
  SodiumClassification,
  RapidSodiumCorrectionRequest,
  RapidSodiumCorrectionResponse,
  SlowSodiumCorrectionRequest,
  SlowSodiumCorrectionResponse,
  HyponatremiaSeverity,
} from '../models/sodium';

export function classifySodium(naLevel: number): SodiumClassification {
  if (naLevel < 135) {
    let severity: HyponatremiaSeverity;
    if (naLevel >= 130) severity = 'leve';
    else if (naLevel >= 125) severity = 'moderada';
    else severity = 'severa';

    return { status: 'hiponatremia', severity, naLevel };
  } else if (naLevel > 145) {
    // Hipernatremia is defined as Na > 145 mEq/L
    return { status: 'hipernatremia', severity: 'normal', naLevel };
  }

  return { status: 'normal', severity: 'normal', naLevel };
}

export async function calculateRapidCorrection(
  request: RapidSodiumCorrectionRequest,
  constants: ClinicalConstants = CLINICAL_CONSTANTS,
): Promise<RapidSodiumCorrectionResponse> {
  const { patient, doseMlKg = 4 } = request;

  const steps: CalculationStep[] = [];
  const alerts: ValidationAlert[] = [];

  const maxDoseLimitMl = 100; // Límite estándar pediátrico de bolo único de NaCl al 3%

  // 1. Calcular volumen teórico
  const calculatedVolume = parseFloat((patient.weight * doseMlKg).toFixed(2));
  steps.push({
    name: 'Volumen Teórico de NaCl 3%',
    formula: 'Volumen (ml) = Peso (kg) * Dosis (ml/kg)',
    development: `${patient.weight} kg * ${doseMlKg} ml/kg`,
    result: `${calculatedVolume} ml`,
  });

  // 2. Aplicar dosis máxima de seguridad
  const bolusVolumeMl = calculatedVolume > maxDoseLimitMl ? maxDoseLimitMl : calculatedVolume;
  steps.push({
    name: 'Volumen de Bolo Aplicado (Límite Máximo)',
    formula: 'Bolo Final = Mínimo entre Volumen Teórico y Límite Máximo (100 ml)',
    development: `${calculatedVolume} ml vs ${maxDoseLimitMl} ml`,
    result: `${bolusVolumeMl} ml`,
  });

  if (calculatedVolume > maxDoseLimitMl) {
    alerts.push({
      type: 'warning',
      parameter: 'bolo_maximo',
      message: `El volumen teórico calculado (${calculatedVolume} ml) supera el bolo máximo recomendado de ${maxDoseLimitMl} ml para infusión rápida. Se limitó la dosis a ${maxDoseLimitMl} ml para seguridad.`,
    });
  }

  // 3. mEq de Sodio suministrados
  const mEqDelivered = parseFloat(
    (bolusVolumeMl * constants.naCl_3_mEq_per_ml_for_bolus).toFixed(2),
  );
  steps.push({
    name: 'mEq de Sodio Suministrados',
    formula: 'mEq de Sodio = Volumen del Bolo (ml) * Concentración NaCl 3% (mEq/ml)',
    development: `${bolusVolumeMl} ml * ${constants.naCl_3_mEq_per_ml_for_bolus} mEq/ml`,
    result: `${mEqDelivered} mEq de Na+`,
  });

  // Indicación médica para bolo de NaCl 3%
  const instructionText =
    `INDICACIÓN MÉDICA PEDIÁTRICA (BOLO DE NaCl 3%):\n` +
    `Administrar bolo de solución de NaCl al 3% para corrección rápida de hiponatremia sintomática.\n` +
    `Volumen total a infundir: ${bolusVolumeMl} ml de NaCl al 3% (dosis: ${doseMlKg} ml/kg, aporta ${mEqDelivered} mEq de Na+).\n` +
    `Velocidad de infusión: Infundir por vía venosa (idealmente central) en un lapso de 15 a 30 minutos.\n` +
    `Monitoreo: Realizar control de ionograma sérico posterior e iniciar corrección lenta si es necesario.`;

  const medicalOrder: MedicalOrder = {
    solutionVolumeMl: bolusVolumeMl,
    electrolyteVolumeMl: 0, // El ampolleado al 3% viene pre-preparado o se infunde directamente
    totalVolumeMl: bolusVolumeMl,
    infusionRateMlPerHour: parseFloat((bolusVolumeMl / 0.5).toFixed(2)), // 30 mins = 0.5 horas
    durationHours: 0.5,
    instructionText,
  };

  return {
    patient,
    bolusVolumeMl,
    maxDoseLimitMl,
    mEqDelivered,
    steps,
    alerts,
    medicalOrder,
  };
}

export async function calculateSlowCorrection(
  request: SlowSodiumCorrectionRequest,
  constants: ClinicalConstants = CLINICAL_CONSTANTS,
): Promise<SlowSodiumCorrectionResponse> {
  const { patient, naCurrent, naTarget, bodyWaterFactor = 0.6 } = request;

  const steps: CalculationStep[] = [];
  const alerts: ValidationAlert[] = [];

  // Validar parámetros
  if (naCurrent >= naTarget) {
    alerts.push({
      type: 'danger',
      parameter: 'na_niveles',
      message: `El sodio actual (${naCurrent} mEq/L) es mayor o igual al sodio objetivo (${naTarget} mEq/L). No se requiere corrección de déficit.`,
    });
  }

  const deltaNa = naTarget - naCurrent;
  if (deltaNa > 10) {
    alerts.push({
      type: 'warning',
      parameter: 'delta_sodio',
      message: `El incremento de sodio propuesto (${deltaNa} mEq/L) supera la recomendación de aumento máximo diario (< 10 mEq/L en 24 horas) para evitar Síndrome de Desmielinización Osmótica.`,
    });
  }

  // 1. Cálculo de Déficit Clásico
  // Fórmula: Deficit = factor * peso * (Na_objetivo - Na_actual)
  const naDeficitMEq = parseFloat((bodyWaterFactor * patient.weight * deltaNa).toFixed(2));
  steps.push({
    name: 'Déficit Total de Sodio (mEq)',
    formula: 'Déficit (mEq) = Agua Corporal Total * Peso (kg) * (Sodio Objetivo - Sodio Actual)',
    development: `${bodyWaterFactor} * ${patient.weight} kg * (${naTarget} - ${naCurrent} mEq/L)`,
    result: `${naDeficitMEq} mEq`,
  });

  // 2. Volumen usando ampolla de NaCl 20% (para agregar a sueros de mantenimiento)
  const mlNaCl20 = parseFloat((naDeficitMEq / constants.naCl_20_mEq_per_ml).toFixed(2));
  steps.push({
    name: 'Volumen Equivalente en NaCl al 20% (Hipertónico)',
    formula: 'Volumen 20% (ml) = Déficit (mEq) / Concentración NaCl 20% (mEq/ml)',
    development: `${naDeficitMEq} mEq / ${constants.naCl_20_mEq_per_ml} mEq/ml`,
    result: `${mlNaCl20} ml`,
  });

  // 3. Volumen usando solución NaCl 3% (para infusión independiente)
  const mlNaCl3 = parseFloat((naDeficitMEq / constants.naCl_3_mEq_per_ml).toFixed(2));
  steps.push({
    name: 'Volumen Equivalente en Solución de NaCl al 3%',
    formula: 'Volumen 3% (ml) = Déficit (mEq) / Concentración NaCl 3% (mEq/ml)',
    development: `${naDeficitMEq} mEq / ${constants.naCl_3_mEq_per_ml} mEq/ml`,
    result: `${mlNaCl3} ml`,
  });

  return {
    patient,
    naDeficitMEq: naDeficitMEq < 0 ? 0 : naDeficitMEq,
    mlNaCl20: mlNaCl20 < 0 ? 0 : mlNaCl20,
    mlNaCl3: mlNaCl3 < 0 ? 0 : mlNaCl3,
    steps,
    alerts,
  };
}
