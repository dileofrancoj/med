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

export const classifyPotassiumSchema = z.object({
  query: z.object({
    kLevel: z.string({ error: 'Falta parámetro kLevel' }).refine((val) => !isNaN(parseFloat(val)), {
      message: 'kLevel debe ser un número válido',
    }),
  }),
});

export const potassiumCalculateSchema = z.object({
  body: z.discriminatedUnion('useCase', [
    z.object({
      useCase: z.literal('rapid'),
      patient: z.object(
        {
          weight: z
            .number({ error: 'Los datos del paciente con su peso (weight) son obligatorios' })
            .positive('El peso debe ser mayor a 0'),
          accessType: z.enum(['central', 'peripheral'], {
            error: () => 'El tipo de acceso debe ser central o periferico.',
          }),
        },
        { error: 'Los datos del paciente con su peso (weight) son obligatorios' },
      ),
      doseMEqKg: numeric.refine((val) => val === 0.5 || val === 1.0, {
        message: 'La dosis de corrección rápida debe ser 0.5 o 1.0 mEq/kg',
      }),
      infusionTimeHours: numeric.refine((val) => val === 2 || val === 3, {
        message: 'El tiempo de infusión debe ser 2 o 3 horas',
      }),
      selectedConcentrationMEqL: numeric.refine((val) => val !== 0 && !isNaN(val), {
        message: 'La dosis de corrección rápida debe ser 0.5 o 1.0 mEq/kg',
      }),
      customDilutionFluidVolumeMl: z.number().optional(),
      classification: z.any().optional(),
    }),
    z.object({
      useCase: z.literal('maintenance'),
      patient: z
        .object({
          weight: z.number().positive().optional(),
          accessType: z.enum(['central', 'peripheral']).optional(),
        })
        .refine((pat) => pat.weight !== undefined, {
          message: 'Los datos del paciente con su peso (weight) son obligatorios',
        }),
      dailyRequirementMEqKg: numeric,
      infusionTimeHours: numeric.optional(),
      selectedConcentrationMEqL: numeric.optional(),
      customDilutionFluidVolumeMl: z.number().optional(),
    }),
  ]),
});
