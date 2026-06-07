import { Request, Response } from 'express';
import * as sodiumService from '../services/sodium_service';

export const classifySodium = async (req: Request, res: Response): Promise<void> => {
  try {
    const naLevelStr = req.query.naLevel as string;
    if (!naLevelStr) {
      res.status(400).json({ error: 'Falta parámetro naLevel' });
      return;
    }

    const naLevel = parseFloat(naLevelStr);
    if (isNaN(naLevel)) {
      res.status(400).json({ error: 'naLevel debe ser un número válido' });
      return;
    }

    const classification = sodiumService.classifySodium(naLevel);
    res.status(200).json(classification);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error interno del servidor';
    res.status(500).json({ error: msg });
  }
};

export const calculateRapidCorrection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patient, doseMlKg } = req.body;

    if (!patient || !patient.weight) {
      res
        .status(400)
        .json({ error: 'Los datos del paciente con su peso (weight) son obligatorios' });
      return;
    }

    if (doseMlKg !== undefined && (typeof doseMlKg !== 'number' || doseMlKg <= 0)) {
      res
        .status(400)
        .json({ error: 'La dosis (doseMlKg) debe ser un número positivo en ml/kg (ej: 4 o 6)' });
      return;
    }

    const result = await sodiumService.calculateRapidCorrection({
      patient,
      doseMlKg,
    });

    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error interno del servidor';
    res.status(500).json({ error: msg });
  }
};

export const calculateSlowCorrection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patient, naCurrent, naTarget, bodyWaterFactor } = req.body;

    if (!patient || !patient.weight) {
      res
        .status(400)
        .json({ error: 'Los datos del paciente con su peso (weight) son obligatorios' });
      return;
    }

    if (naCurrent === undefined || typeof naCurrent !== 'number') {
      res
        .status(400)
        .json({ error: 'El sodio actual (naCurrent) es obligatorio y debe ser un número válido' });
      return;
    }

    if (naTarget === undefined || typeof naTarget !== 'number') {
      res
        .status(400)
        .json({ error: 'El sodio objetivo (naTarget) es obligatorio y debe ser un número válido' });
      return;
    }

    const result = await sodiumService.calculateSlowCorrection({
      patient,
      naCurrent,
      naTarget,
      bodyWaterFactor,
    });

    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error interno del servidor';
    res.status(500).json({ error: msg });
  }
};
