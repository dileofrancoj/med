import { Request, Response } from 'express';
import {
  isInvalidPotassiumDose,
  isInvalidPotassiumInfusionTimeHours,
} from '../utils/validate_potassium';
import * as potassiumService from '../services/potassium_service';
import * as potassiumUtils from '../utils/validate_potassium';
import { PotassiumMapper } from '../mappers/potassium_mapper';

export const classifyPotassium = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const kLevelStr = req.query.kLevel as string;
    if (!kLevelStr) {
      return res.status(400).json({ error: 'Falta parámetro kLevel' });
    }

    const kLevel = parseFloat(kLevelStr);
    if (isNaN(kLevel)) {
      return res.status(400).json({ error: 'kLevel debe ser un número válido' });
    }

    const classification = potassiumUtils.classifyPotassium(kLevel);
    res.status(200).json(classification);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error interno del servidor';
    return res.status(500).json({ error: msg });
  }
};

export const calculateRapidCorrection = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { patient } = req.body;

    if (!patient || !patient.weight) {
      return res
        .status(400)
        .json({ error: 'Los datos del paciente con su peso (weight o weightKg) son obligatorios' });
    }

    const domainRequest = PotassiumMapper.toRapidCorrection(req.body);
    if (
      domainRequest.patient.venousAccess !== 'central' &&
      domainRequest.patient.venousAccess !== 'peripheral'
    ) {
      return res.status(400).json({ error: 'El tipo de acceso debe ser central o periferico.' });
    }
    if (
      domainRequest.selectedConcentrationMEqL == 0 ||
      isNaN(domainRequest.selectedConcentrationMEqL)
    ) {
      return res
        .status(400)
        .json({ error: 'La dosis de corrección rápida debe ser 0.5 o 1.0 mEq/kg' });
    }

    if (isInvalidPotassiumDose(domainRequest.doseMEqKg)) {
      return res
        .status(400)
        .json({ error: 'La dosis de corrección rápida debe ser 0.5 o 1.0 mEq/kg' });
    }

    if (isInvalidPotassiumInfusionTimeHours(domainRequest.infusionTimeHours)) {
      return res.status(400).json({ error: 'El tiempo de infusión debe ser 2 o 3 horas' });
    }
    const response = await potassiumService.calculateRapidCorrection(domainRequest);
    const responseDto = PotassiumMapper.toRapidCorrectionResponseDto(response);

    return res.status(200).json(responseDto);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error interno del servidor';
    return res.status(500).json({ error: msg });
  }
};

export const calculateMaintenance = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const { patient, dailyRequirementMEqKg } = req.body;

    if (!patient || (!patient.weight && !patient.weightKg)) {
      return res
        .status(400)
        .json({ error: 'Los datos del paciente con su peso (weight o weightKg) son obligatorios' });
    }

    if (dailyRequirementMEqKg === undefined || isNaN(parseFloat(dailyRequirementMEqKg))) {
      return res.status(400).json({
        error: 'El requerimiento diario (dailyRequirementMEqKg) debe ser un número válido',
      });
    }

    const domainRequest = PotassiumMapper.toMaintenanceDomain(req.body);
    const result = await potassiumService.calculateMaintenance(domainRequest);
    const responseDto = PotassiumMapper.toMaintenanceResponseDto(result);

    res.status(200).json(responseDto);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error interno del servidor';
    res.status(500).json({ error: msg });
  }
};
