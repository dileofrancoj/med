import { z } from 'zod';

const numeric = z.union([
  z.number(),
  z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), {
      message: 'Debe ser un número válido',
    })
    .transform((val) => parseFloat(val)),
]);

export const classifySodiumSchema = z.object({
  query: z.object({
    naLevel: z
      .string({ error: 'Falta parámetro naLevel' })
      .refine((val) => !isNaN(parseFloat(val)), {
        message: 'naLevel debe ser un número válido',
      }),
  }),
});

export const rapidCorrectionSodiumSchema = z.object({
  body: z.object({
    patient: z.object(
      {
        weight: z
          .number({
            error: 'Los datos del paciente con su peso (weight) son obligatorios',
          })
          .positive('El peso debe ser mayor a 0'),
      },
      { error: 'Los datos del paciente con su peso (weight) son obligatorios' },
    ),
    doseMlKg: numeric
      .refine((val) => val > 0, {
        message: 'La dosis (doseMlKg) debe ser un número positivo en ml/kg (ej: 4 o 6)',
      })
      .optional(),
  }),
});

export const slowCorrectionSodiumSchema = z.object({
  body: z.object({
    patient: z.object(
      {
        weight: z
          .number({
            error: 'Los datos del paciente con su peso (weight) son obligatorios',
          })
          .positive('El peso debe ser mayor a 0'),
      },
      { error: 'Los datos del paciente con su peso (weight) son obligatorios' },
    ),
    naCurrent: numeric,
    naTarget: numeric,
    bodyWaterFactor: numeric.optional(),
  }),
});
