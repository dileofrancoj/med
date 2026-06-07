import { Request, Response } from 'express';
import {
  isInvalidPotassiumDose,
  isInvalidPotassiumInfusionTimeHours,
} from '../utils/validate_potassium';
import * as potassiumService from '../services/potassium_service';
import * as potassiumUtils from '../utils/validate_potassium';

export const classifyPotassium = async (req: Request, res: Response): Promise<void> => {
  try {
    const kLevelStr = req.query.kLevel as string;
    if (!kLevelStr) {
      res.status(400).json({ error: 'Falta parámetro kLevel' });
      return;
    }

    const kLevel = parseFloat(kLevelStr);
    if (isNaN(kLevel)) {
      res.status(400).json({ error: 'kLevel debe ser un número válido' });
      return;
    }

    const classification = potassiumUtils.classifyPotassium(kLevel);
    res.status(200).json(classification);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error interno del servidor';
    res.status(500).json({ error: msg });
  }
};

export const calculateRapidCorrection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patient, doseMEqKg, infusionTimeHours, customDilutionFluidVolumeMl } = req.body;

    if (!patient || !patient.weight) {
      res
        .status(400)
        .json({ error: 'Los datos del paciente con su peso (weight) son obligatorios' });
      return;
    }

    if (isInvalidPotassiumDose(doseMEqKg)) {
      res.status(400).json({ error: 'La dosis de corrección rápida debe ser 0.5 o 1.0 mEq/kg' });
      return;
    }
    console.log('infusionTimeHours', infusionTimeHours);
    if (isInvalidPotassiumInfusionTimeHours(infusionTimeHours)) {
      res.status(400).json({ error: 'El tiempo de infusión debe ser 2 o 3 horas' });
      return;
    }

    const result = await potassiumService.calculateRapidCorrection({
      patient,
      doseMEqKg,
      infusionTimeHours,
      customDilutionFluidVolumeMl,
    });

    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error interno del servidor';
    res.status(500).json({ error: msg });
  }
};

export const calculateMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patient, dailyRequirementMEqKg } = req.body;

    if (!patient || !patient.weight) {
      res
        .status(400)
        .json({ error: 'Los datos del paciente con su peso (weight) son obligatorios' });
      return;
    }

    if (dailyRequirementMEqKg === undefined || typeof dailyRequirementMEqKg !== 'number') {
      res
        .status(400)
        .json({
          error: 'El requerimiento diario (dailyRequirementMEqKg) debe ser un número válido',
        });
      return;
    }

    const result = await potassiumService.calculateMaintenance({
      patient,
      dailyRequirementMEqKg,
    });

    res.status(200).json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error interno del servidor';
    res.status(500).json({ error: msg });
  }
};
