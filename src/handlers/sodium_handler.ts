import { Request, Response } from 'express';
import * as sodiumService from '../services/sodium_service';

export const classifySodium = async (req: Request, res: Response): Promise<void> => {
  try {
    const naLevelStr = req.query.naLevel as string;
    const naLevel = parseFloat(naLevelStr);

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
