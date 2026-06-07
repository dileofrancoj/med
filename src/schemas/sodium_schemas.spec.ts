import { describe, it, expect } from 'vitest';
import {
  classifySodiumSchema,
  rapidCorrectionSodiumSchema,
  slowCorrectionSodiumSchema,
} from './sodium_schemas';

describe('Sodium Schemas', () => {
  describe('classifySodiumSchema', () => {
    it('should validate valid query', async () => {
      const payload = {
        query: {
          naLevel: '135.5',
        },
      };
      const result = await classifySodiumSchema.safeParseAsync(payload);
      expect(result.success).toBe(true);
    });

    it('should fail on invalid level', async () => {
      const payload = {
        query: {
          naLevel: 'not-a-number',
        },
      };
      const result = await classifySodiumSchema.safeParseAsync(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('rapidCorrectionSodiumSchema', () => {
    it('should validate valid body', async () => {
      const payload = {
        body: {
          patient: {
            weight: 70,
          },
          doseMlKg: 4,
        },
      };
      const result = await rapidCorrectionSodiumSchema.safeParseAsync(payload);
      expect(result.success).toBe(true);
    });

    it('should fail if doseMlKg is negative', async () => {
      const payload = {
        body: {
          patient: {
            weight: 70,
          },
          doseMlKg: -1,
        },
      };
      const result = await rapidCorrectionSodiumSchema.safeParseAsync(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('slowCorrectionSodiumSchema', () => {
    it('should validate valid body', async () => {
      const payload = {
        body: {
          patient: {
            weight: 70,
          },
          naCurrent: 125,
          naTarget: 135,
          bodyWaterFactor: 0.6,
        },
      };
      const result = await slowCorrectionSodiumSchema.safeParseAsync(payload);
      expect(result.success).toBe(true);
    });

    it('should fail if missing naCurrent', async () => {
      const payload = {
        body: {
          patient: {
            weight: 70,
          },
          naTarget: 135,
        },
      };
      const result = await slowCorrectionSodiumSchema.safeParseAsync(payload);
      expect(result.success).toBe(false);
    });
  });
});
