import { describe, it, expect } from 'vitest';
import * as sodiumService from './sodium_service';
import { Patient } from '../models/patient';

describe('Sodium Service Pure Functions Unit Tests', () => {
  describe('Classification of Sodium Levels', () => {
    it('should classify normal levels correctly', () => {
      const res = sodiumService.classifySodium(140);
      expect(res.status).toBe('normal');
      expect(res.severity).toBe('normal');
    });

    it('should classify mild hyponatremia correctly', () => {
      const res = sodiumService.classifySodium(132);
      expect(res.status).toBe('hiponatremia');
      expect(res.severity).toBe('leve');
    });

    it('should classify moderate hyponatremia correctly', () => {
      const res = sodiumService.classifySodium(127);
      expect(res.status).toBe('hiponatremia');
      expect(res.severity).toBe('moderada');
    });

    it('should classify severe hyponatremia correctly', () => {
      const res = sodiumService.classifySodium(120);
      expect(res.status).toBe('hiponatremia');
      expect(res.severity).toBe('severa');
    });

    it('should classify hypernatremia correctly', () => {
      const res = sodiumService.classifySodium(148);
      expect(res.status).toBe('hipernatremia');
    });
  });

  describe('Rapid Sodium Correction (3% NaCl Bolus)', () => {
    const patient: Patient = { weight: 15 };

    it('should calculate 4 ml/kg bolus properly', async () => {
      const res = await sodiumService.calculateRapidCorrection({
        patient,
        doseMlKg: 4,
      });

      expect(res.bolusVolumeMl).toBe(60); // 15kg * 4 ml/kg = 60ml
      expect(res.mEqDelivered).toBeCloseTo(30.78, 1); // 60ml * 0.513 mEq/ml = 30.78 mEq
      expect(res.alerts).toHaveLength(0);
    });

    it('should cap bolus volume to maximum 100ml safety threshold', async () => {
      const heavyPatient: Patient = { weight: 30 };
      const res = await sodiumService.calculateRapidCorrection({
        patient: heavyPatient,
        doseMlKg: 4, // 30kg * 4 = 120ml -> should be capped at 100ml
      });

      expect(res.bolusVolumeMl).toBe(100);
      expect(res.alerts).toContainEqual(
        expect.objectContaining({
          type: 'warning',
          parameter: 'bolo_maximo',
        }),
      );
    });
  });

  describe('Slow Sodium Correction (Classical Deficit)', () => {
    const patient: Patient = { weight: 10 };

    it('should calculate sodium deficit and ampolla equivalents', async () => {
      const res = await sodiumService.calculateSlowCorrection({
        patient,
        naCurrent: 125,
        naTarget: 133, // delta = 8, safe (< 10)
      });

      // Deficit = 0.6 * 10kg * 8 mEq/L = 48 mEq
      expect(res.naDeficitMEq).toBe(48);
      expect(res.mlNaCl20).toBeCloseTo(14.12, 1); // 48 / 3.4 mEq/ml = 14.12 ml
      expect(res.mlNaCl3).toBeCloseTo(93.57, 1); // 48 / 0.513 mEq/ml = 93.57 ml
      expect(res.alerts).toHaveLength(0);
    });

    it('should issue alert when target delta Na exceeds 10 mEq/L limit', async () => {
      const res = await sodiumService.calculateSlowCorrection({
        patient,
        naCurrent: 120,
        naTarget: 132, // delta = 12 (unsafe!)
      });

      expect(res.alerts).toContainEqual(
        expect.objectContaining({
          type: 'warning',
          parameter: 'delta_sodio',
        }),
      );
    });
  });
});
