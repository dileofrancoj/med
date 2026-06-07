export interface ClinicalConstants {
  clK_mEq_per_ml: number;
  naCl_20_mEq_per_ml: number;
  naCl_3_mEq_per_ml: number;
  maxPotassiumFlowMEqKgH: number;
  maxPotassiumConcentrationPeripheralMEqMl: number;
  maxPotassiumConcentrationCentralMEqMl: number;
  naCl_3_mEq_per_ml_for_bolus: number;
}

export const CLINICAL_CONSTANTS: ClinicalConstants = {
  clK_mEq_per_ml: 3.0, // Ampolla de ClK al 20%: 3 mEq por ml (aprox)
  naCl_20_mEq_per_ml: 3.4, // Ampolla de NaCl al 20%: 3.4 mEq por ml
  naCl_3_mEq_per_ml: 0.513, // Solución de NaCl al 3%: 0.513 mEq por ml
  maxPotassiumFlowMEqKgH: 1.0, // Límite de seguridad: Flujo de Potasio máximo de 1 mEq/kg/hora
  maxPotassiumConcentrationPeripheralMEqMl: 0.04, // Límite periférico: 40 mEq/L = 0.04 mEq/ml
  maxPotassiumConcentrationCentralMEqMl: 0.08, // Límite central: 80 mEq/L = 0.08 mEq/ml
  naCl_3_mEq_per_ml_for_bolus: 0.513,
};
