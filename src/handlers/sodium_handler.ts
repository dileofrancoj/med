import { Request, Response } from 'express';
import { ISodiumService } from '../services/sodium_service';

export class SodiumHandler {
  constructor(private sodiumService: ISodiumService) {}

  classifySodium = async (req: Request, res: Response): Promise<void> => {
    try {
      const naLevelStr = req.query.naLevel as string;
      const naLevel = parseFloat(naLevelStr);

      const classification = this.sodiumService.classifySodium(naLevel);
      res.status(200).json(classification);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error interno del servidor';
      res.status(500).json({ error: msg });
    }
  };

  calculateRapidCorrection = async (req: Request, res: Response): Promise<void> => {
    try {
      const { patient, doseMlKg } = req.body;

      const result = await this.sodiumService.calculateRapidCorrection({
        patient,
        doseMlKg,
      });

      res.status(200).json(result);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error interno del servidor';
      res.status(500).json({ error: msg });
    }
  };

  calculateSlowCorrection = async (req: Request, res: Response): Promise<void> => {
    try {
      const { patient, naCurrent, naTarget, bodyWaterFactor } = req.body;

      const result = await this.sodiumService.calculateSlowCorrection({
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
}
