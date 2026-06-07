import { CLINICAL_CONSTANTS, ClinicalConstants } from '../constants/clinical';
import { ValidationAlert, CalculationStep, MedicalOrder } from '../models/common';
import {
  RapidPotassiumCorrectionRequest,
  RapidPotassiumCorrectionResponse,
  PotassiumMaintenanceRequest,
  PotassiumMaintenanceResponse,
} from '../models/potassium';

export async function calculateRapidCorrection(
  config: RapidPotassiumCorrectionRequest,
  constants: ClinicalConstants = CLINICAL_CONSTANTS,
): Promise<RapidPotassiumCorrectionResponse> {
  const { patient, doseMEqKg, infusionTimeHours, customDilutionFluidVolumeMl } = config;

  const steps: CalculationStep[] = [];
  const alerts: ValidationAlert[] = [];

  // 1. mEq Requeridos
  const mEqRequired = parseFloat((patient.weight * doseMEqKg).toFixed(2));
  steps.push({
    name: 'mEq de Potasio Requeridos',
    formula: 'mEq = Peso (kg) * Dosis (mEq/kg)',
    development: `${patient.weight} kg * ${doseMEqKg} mEq/kg`,
    result: `${mEqRequired} mEq`,
  });

  // 2. ml de ClK
  const mlClK = parseFloat((mEqRequired / constants.clK_mEq_per_ml).toFixed(2));
  steps.push({
    name: 'Volumen de ClK (Ampolla al 20%)',
    formula: 'ml de ClK = mEq Requeridos / Concentración de ClK (mEq/ml)',
    development: `${mEqRequired} mEq / ${constants.clK_mEq_per_ml} mEq/ml`,
    result: `${mlClK} ml`,
  });

  // 3. Flujo mEq/kg/h
  const flowMEqKgH = parseFloat((doseMEqKg / infusionTimeHours).toFixed(2));
  steps.push({
    name: 'Flujo de Infusión de Potasio',
    formula: 'Flujo (mEq/kg/h) = Dosis Seleccionada (mEq/kg) / Tiempo de Infusión (h)',
    development: `${doseMEqKg} mEq/kg / ${infusionTimeHours} h`,
    result: `${flowMEqKgH} mEq/kg/h`,
  });

  if (flowMEqKgH > constants.maxPotassiumFlowMEqKgH) {
    alerts.push({
      type: 'danger',
      parameter: 'flujo',
      message: `El flujo calculado (${flowMEqKgH} mEq/kg/h) supera el límite de seguridad de ${constants.maxPotassiumFlowMEqKgH} mEq/kg/h. ¡Riesgo de cardiotoxicidad!`,
    });
  }

  // 4. Volumen de Dilución & Concentración
  const access = patient.venousAccess || 'peripheral';
  const maxAllowedConcentrationMEqMl =
    access === 'peripheral'
      ? constants.maxPotassiumConcentrationPeripheralMEqMl
      : constants.maxPotassiumConcentrationCentralMEqMl;

  const selectedConcentrationMEqMl = config.selectedConcentrationMEqL / 1000;
  if (selectedConcentrationMEqMl > maxAllowedConcentrationMEqMl) {
    alerts.push({
      type: 'danger',
      parameter: 'flujo',
      message: `La concentración seleccionada (${selectedConcentrationMEqMl * 1000} mEq/L) supera el máximo permitido para ${access} (${maxAllowedConcentrationMEqMl * 1000} mEq/L).`,
    });
  }
  let dilutionFluidVolumeMl: number;
  let isCustom = false;

  if (customDilutionFluidVolumeMl !== undefined) {
    dilutionFluidVolumeMl = customDilutionFluidVolumeMl;
    isCustom = true;
  } else {
    // Calcular volumen mínimo seguro
    const minTotalVolume = mEqRequired / selectedConcentrationMEqMl;
    const calculatedDilution = Math.ceil(minTotalVolume - mlClK);
    dilutionFluidVolumeMl = calculatedDilution < 10 ? 10 : calculatedDilution;
  }

  const totalVolumeMl = parseFloat((dilutionFluidVolumeMl + mlClK).toFixed(2));
  const concentrationMEqMl = parseFloat((mEqRequired / totalVolumeMl).toFixed(4));
  const concentrationMEqL = parseFloat((concentrationMEqMl * 1000).toFixed(2));

  steps.push({
    name: 'Volumen de Dilución Sugerido',
    formula: 'Volumen Total Mínimo (ml) = mEq Requeridos / Límite de Concentración (mEq/ml)',
    development: isCustom
      ? `Usando volumen personalizado del usuario: ${dilutionFluidVolumeMl} ml de dilución`
      : `mEq Requeridos: ${mEqRequired} mEq / Límite (${selectedConcentrationMEqMl} mEq/ml) - ml ClK (${mlClK} ml)`,
    result: `${dilutionFluidVolumeMl} ml de solución compatible`,
  });

  steps.push({
    name: 'Concentración Final de Potasio',
    formula: 'Concentración = mEq Requeridos / Volumen Total (ml)',
    development: `${mEqRequired} mEq / ${totalVolumeMl} ml`,
    result: `${concentrationMEqL} mEq/L (${concentrationMEqMl} mEq/ml)`,
  });

  // Validar concentración según acceso venoso
  if (
    access === 'peripheral' &&
    concentrationMEqMl > constants.maxPotassiumConcentrationPeripheralMEqMl
  ) {
    alerts.push({
      type: 'danger',
      parameter: 'concentracion_periferica',
      message: `La concentración final (${concentrationMEqL} mEq/L) supera el límite seguro para vía periférica (${constants.maxPotassiumConcentrationPeripheralMEqMl * 1000} mEq/L). Riesgo de flebitis química.`,
    });
  } else if (
    access === 'central' &&
    concentrationMEqMl > constants.maxPotassiumConcentrationCentralMEqMl
  ) {
    alerts.push({
      type: 'danger',
      parameter: 'concentracion_central',
      message: `La concentración final (${concentrationMEqL} mEq/L) supera el límite extremo seguro para vía central (${constants.maxPotassiumConcentrationCentralMEqMl * 1000} mEq/L). ¡Extremar precauciones!`,
    });
  } else if (
    access === 'central' &&
    concentrationMEqMl > constants.maxPotassiumConcentrationPeripheralMEqMl
  ) {
    alerts.push({
      type: 'info',
      parameter: 'concentracion_via_central',
      message: `La concentración de ${concentrationMEqL} mEq/L es segura ya que se administra por vía central (límite vía central: ${constants.maxPotassiumConcentrationCentralMEqMl * 1000} mEq/L).`,
    });
  }

  // 5. Velocidad de Infusión (ml/h)
  const infusionRateMlPerHour = parseFloat((totalVolumeMl / infusionTimeHours).toFixed(2));
  steps.push({
    name: 'Velocidad de Infusión',
    formula: 'Velocidad (ml/h) = Volumen Total (ml) / Tiempo de Infusión (h)',
    development: `${totalVolumeMl} ml / ${infusionTimeHours} h`,
    result: `${infusionRateMlPerHour} ml/h`,
  });

  // Indicación médica estructurada
  const accessText = access === 'peripheral' ? 'Vía Periférica' : 'Vía Central';
  const instructionText =
    `INDICACIÓN MÉDICA PEDIÁTRICA (${accessText}):\n` +
    `Administrar una corrección rápida de Potasio de ${mEqRequired} mEq (${doseMEqKg} mEq/kg) por ${accessText}.\n` +
    `Preparación: Agregar ${mlClK} ml de Cloruro de Potasio (ClK al 20%) a ${dilutionFluidVolumeMl} ml de Solución compatible (ej. Solución Fisiológica 0.9% o Dextrosa 5%).\n` +
    `Volumen Total a infundir: ${totalVolumeMl} ml.\n` +
    `Velocidad de infusión: Infundir a ${infusionRateMlPerHour} ml/h en bomba de infusión continua por un lapso de ${infusionTimeHours} horas.\n` +
    `Flujo de potasio: ${flowMEqKgH} mEq/kg/h.`;

  const medicalOrder: MedicalOrder = {
    solutionVolumeMl: dilutionFluidVolumeMl,
    electrolyteVolumeMl: mlClK,
    totalVolumeMl,
    infusionRateMlPerHour,
    durationHours: infusionTimeHours,
    instructionText,
  };

  return {
    patient,
    mEqRequired,
    mlClK,
    dilutionFluidVolumeMl,
    totalVolumeMl,
    infusionRateMlPerHour,
    flowMEqKgH,
    alerts,
    steps,
    medicalOrder,
  };
}

export async function calculateMaintenance(
  request: PotassiumMaintenanceRequest,
  constants: ClinicalConstants = CLINICAL_CONSTANTS,
): Promise<PotassiumMaintenanceResponse> {
  const { patient, dailyRequirementMEqKg } = request;
  const steps: CalculationStep[] = [];

  const mEqRequired = parseFloat((patient.weight * dailyRequirementMEqKg).toFixed(2));
  steps.push({
    name: 'Requerimiento Diario de Potasio',
    formula: 'mEq Diarios = Peso (kg) * Requerimiento diario (mEq/kg/día)',
    development: `${patient.weight} kg * ${dailyRequirementMEqKg} mEq/kg/día`,
    result: `${mEqRequired} mEq/día`,
  });

  const mlClK = parseFloat((mEqRequired / constants.clK_mEq_per_ml).toFixed(2));
  steps.push({
    name: 'Volumen de ClK a agregar en las soluciones de 24 hs',
    formula: 'ml de ClK = mEq Requeridos / Concentración ClK (mEq/ml)',
    development: `${mEqRequired} mEq / ${constants.clK_mEq_per_ml} mEq/ml`,
    result: `${mlClK} ml`,
  });

  return {
    patient,
    mEqRequired,
    mlClK,
    dailyContributionMEq: mEqRequired,
    steps,
  };
}
