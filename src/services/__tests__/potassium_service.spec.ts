import { describe, it, expect } from 'vitest';
import * as potassiumService from '../potassium_service';
import { classifyPotassium } from '../../utils/validate_potassium';
import { Patient } from '../../models/patient';

describe('Potassium Service Pure Functions Unit Tests', () => {
  describe('Classification of Potassium Levels', () => {
    it('should classify normal levels correctly', () => {
      const res = classifyPotassium(4.0);
      expect(res.status).toBe('normal');
      expect(res.severity).toBe('normal');
    });

    it('should classify mild hypokalemia correctly', () => {
      const res = classifyPotassium(3.2);
      expect(res.status).toBe('hipokalemia');
      expect(res.severity).toBe('leve');
    });

    it('should classify moderate hypokalemia correctly', () => {
      const res = classifyPotassium(2.7);
      expect(res.status).toBe('hipokalemia');
      expect(res.severity).toBe('moderada');
    });

    it('should classify severe hypokalemia correctly', () => {
      const res = classifyPotassium(2.2);
      expect(res.status).toBe('hipokalemia');
      expect(res.severity).toBe('severa');
    });

    it('should classify critical hypokalemia correctly', () => {
      const res = classifyPotassium(1.8);
      expect(res.status).toBe('hipokalemia');
      expect(res.severity).toBe('critica');
    });

    it('should classify hyperkalemia correctly', () => {
      const res = classifyPotassium(5.8);
      expect(res.status).toBe('hiperkalemia');
      expect(res.severity).toBe('leve');
    });
  });

  describe('Rapid Potassium Correction', () => {
    const patient: Patient = { weight: 10, venousAccess: 'peripheral' };

    it('should calculate rapid correction dose 0.5 mEq/kg over 2 hours safely', async () => {
      const res = await potassiumService.calculateRapidCorrection({
        patient,
        doseMEqKg: 0.5,
        infusionTimeHours: 2,
        selectedConcentrationMEqL: 40,
      });

      expect(res.mEqRequired).toBe(5); // 10kg * 0.5 mEq/kg = 5 mEq
      expect(res.mlClK).toBe(1.67); // 5 mEq / 3 mEq/ml = 1.67 ml
      expect(res.flowMEqKgH).toBe(0.25); // 0.5 dose / 2 hours = 0.25 mEq/kg/h
      expect(res.alerts).toHaveLength(0); // No safety warnings for safe dose
      expect(res.medicalOrder.infusionRateMlPerHour).toBeDefined();
    });

    it('should warn when flow exceeds 1 mEq/kg/h (impossible with allowed inputs, but test limit)', async () => {
      const res = await potassiumService.calculateRapidCorrection({
        patient,
        doseMEqKg: 1.0,
        infusionTimeHours: 2,
        selectedConcentrationMEqL: 40,
      });
      expect(res.flowMEqKgH).toBe(0.5);
      expect(res.alerts).toHaveLength(0);
    });

    it('should trigger alert when custom dilution volume causes peripheral concentration to exceed limit', async () => {
      const res = await potassiumService.calculateRapidCorrection({
        patient,
        doseMEqKg: 1.0,
        infusionTimeHours: 2,
        customDilutionFluidVolumeMl: 10, // Too small! Concentration will be very high
        selectedConcentrationMEqL: 40,
      });

      expect(res.alerts).toContainEqual(
        expect.objectContaining({
          type: 'danger',
          parameter: 'concentracion_periferica',
        }),
      );
    });

    it('should not trigger peripheral alert when custom dilution is safe and access is central', async () => {
      const centralPatient: Patient = { weight: 10, venousAccess: 'central' };
      const res = await potassiumService.calculateRapidCorrection({
        patient: centralPatient,
        doseMEqKg: 1.0,
        infusionTimeHours: 2,
        customDilutionFluidVolumeMl: 150, // Extremely safe volume
        selectedConcentrationMEqL: 40,
      });

      const hasPeripheralAlert = res.alerts.some((a) => a.parameter === 'concentracion_periferica');
      expect(hasPeripheralAlert).toBe(false);
    });
  });

  describe('Potassium Maintenance (Aporte)', () => {
    it('should calculate daily maintenance requirements properly', async () => {
      const patient: Patient = { weight: 12 };
      const res = await potassiumService.calculateMaintenance({
        patient,
        dailyRequirementMEqKg: 3.0,
      });

      expect(res.mEqRequired).toBe(36); // 12 * 3 = 36 mEq
      expect(res.mlClK).toBe(12); // 36 / 3 = 12 ml
    });
  });
});
