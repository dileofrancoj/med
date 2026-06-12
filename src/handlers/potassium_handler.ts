import { Request, Response } from 'express';
import * as potassiumService from '../services/potassium_service';
import * as potassiumUtils from '../utils/validate_potassium';
import { PotassiumMapper } from '../mappers/potassium_mapper';

export const classifyPotassium = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const kLevelStr = req.query.kLevel as string;
    const kLevel = parseFloat(kLevelStr);

    const classification = potassiumUtils.classifyPotassium(kLevel);
    res.status(200).json(classification);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error interno del servidor';
    return res.status(500).json({ error: msg });
  }
};

export const calculatePotassium = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { useCase } = req.body;

    if (useCase === 'rapid') {
      const domainRequest = PotassiumMapper.toRapidCorrection(req.body);
      const response = await potassiumService.calculateRapidCorrection(domainRequest);
      const responseDto = PotassiumMapper.toRapidCorrectionResponseDto(response);
      return res.status(200).json({ useCase, ...responseDto });
    } else {
      const domainRequest = PotassiumMapper.toMaintenanceDomain(req.body);
      const result = await potassiumService.calculateMaintenance(domainRequest);
      const responseDto = PotassiumMapper.toMaintenanceResponseDto(result);
      return res.status(200).json({ useCase, ...responseDto });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error interno del servidor';
    return res.status(500).json({ error: msg });
  }
};
