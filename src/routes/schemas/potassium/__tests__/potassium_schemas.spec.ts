import { describe, it, expect } from 'vitest';
import { rapidCorrectionSchema, maintenanceSchema } from '../potassium_schemas';

describe('Potassium Schemas', () => {
  describe('rapidCorrectionSchema', () => {
    it('should validate valid payload with correct values', async () => {
      const validPayload = {
        body: {
          patient: {
            weight: 70,
            accessType: 'central',
          },
          doseMEqKg: 0.5,
          infusionTimeHours: 2,
          selectedConcentrationMEqL: 100,
        },
      };

      const result = await rapidCorrectionSchema.safeParseAsync(validPayload);
      expect(result.success).toBe(true);
    });

    it('should coerce doseMEqKg from string to number', async () => {
      const payload = {
        body: {
          patient: {
            weight: 70,
            accessType: 'central',
          },
          doseMEqKg: '0.5',
          infusionTimeHours: '2',
          selectedConcentrationMEqL: '100',
        },
      };

      const result = await rapidCorrectionSchema.safeParseAsync(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.body.doseMEqKg).toBe(0.5);
        expect(result.data.body.infusionTimeHours).toBe(2);
        expect(result.data.body.selectedConcentrationMEqL).toBe(100);
      }
    });

    it('should fail if dose is not 0.5 or 1.0', async () => {
      const payload = {
        body: {
          patient: {
            weight: 70,
            accessType: 'central',
          },
          doseMEqKg: 0.7,
          infusionTimeHours: 2,
          selectedConcentrationMEqL: 100,
        },
      };

      const result = await rapidCorrectionSchema.safeParseAsync(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('maintenanceSchema', () => {
    it('should validate if weight is defined', async () => {
      const payload = {
        body: {
          patient: {
            weight: 60,
          },
          dailyRequirementMEqKg: 2.5,
        },
      };
      const result = await maintenanceSchema.safeParseAsync(payload);
      expect(result.success).toBe(true);
    });

    it('should fail if weight are not defined', async () => {
      const payload = {
        body: {
          patient: {
            age: 10,
          },
          dailyRequirementMEqKg: 2.5,
        },
      };
      const result = await maintenanceSchema.safeParseAsync(payload);
      expect(result.success).toBe(false);
    });
  });
});
