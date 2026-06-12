import { describe, it, expect } from 'vitest';
import { potassiumCalculateSchema } from '../potassium_schemas';

describe('Potassium Schemas - Unified calculateSchema', () => {
  describe('rapid correction useCase', () => {
    it('should validate valid payload with correct values', async () => {
      const validPayload = {
        body: {
          useCase: 'rapid',
          patient: {
            weight: 70,
            accessType: 'central',
          },
          doseMEqKg: 0.5,
          infusionTimeHours: 2,
          selectedConcentrationMEqL: 100,
        },
      };

      const result = await potassiumCalculateSchema.safeParseAsync(validPayload);
      expect(result.success).toBe(true);
    });

    it('should coerce doseMEqKg from string to number', async () => {
      const payload = {
        body: {
          useCase: 'rapid',
          patient: {
            weight: 70,
            accessType: 'central',
          },
          doseMEqKg: '0.5',
          infusionTimeHours: '2',
          selectedConcentrationMEqL: '100',
        },
      };

      const result = await potassiumCalculateSchema.safeParseAsync(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        // @ts-expect-error type assertion safe inside tests
        expect(result.data.body.doseMEqKg).toBe(0.5);
        expect(result.data.body.infusionTimeHours).toBe(2);
        expect(result.data.body.selectedConcentrationMEqL).toBe(100);
      }
    });

    it('should fail if dose is not 0.5 or 1.0', async () => {
      const payload = {
        body: {
          useCase: 'rapid',
          patient: {
            weight: 70,
            accessType: 'central',
          },
          doseMEqKg: 0.7,
          infusionTimeHours: 2,
          selectedConcentrationMEqL: 100,
        },
      };

      const result = await potassiumCalculateSchema.safeParseAsync(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('maintenance useCase', () => {
    it('should validate if weight is defined', async () => {
      const payload = {
        body: {
          useCase: 'maintenance',
          patient: {
            weight: 60,
          },
          dailyRequirementMEqKg: 2.5,
        },
      };
      const result = await potassiumCalculateSchema.safeParseAsync(payload);
      expect(result.success).toBe(true);
    });

    it('should fail if weight is not defined', async () => {
      const payload = {
        body: {
          useCase: 'maintenance',
          patient: {},
          dailyRequirementMEqKg: 2.5,
        },
      };
      const result = await potassiumCalculateSchema.safeParseAsync(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('useCase validation', () => {
    it('should fail if useCase is missing', async () => {
      const payload = {
        body: {
          patient: {
            weight: 60,
          },
          dailyRequirementMEqKg: 2.5,
        },
      };
      const result = await potassiumCalculateSchema.safeParseAsync(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const hasUseCaseError = result.error.issues.some(
          (issue) => issue.path.join('.') === 'body.useCase',
        );
        expect(hasUseCaseError).toBe(true);
      }
    });

    it('should fail if useCase is invalid', async () => {
      const payload = {
        body: {
          useCase: 'invalid_case',
          patient: {
            weight: 60,
          },
          dailyRequirementMEqKg: 2.5,
        },
      };
      const result = await potassiumCalculateSchema.safeParseAsync(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const hasUseCaseError = result.error.issues.some(
          (issue) => issue.path.join('.') === 'body.useCase',
        );
        expect(hasUseCaseError).toBe(true);
      }
    });
  });
});
