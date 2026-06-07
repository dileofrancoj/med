import { Patient } from '../models/patient';
import {
  RapidPotassiumCorrectionRequest,
  RapidPotassiumCorrectionResponse,
  PotassiumMaintenanceRequest,
  PotassiumMaintenanceResponse,
} from '../models/potassium';

import * as potassiumHelper from './helpers/potassium_mapper';
import {
  RapidCorrectionRequestDto,
  RapidCorrectionResponseDto,
  PotassiumMaintenanceRequestDto,
  PotassiumMaintenanceResponseDto,
} from './models/Potassium';

// Interfaces for Rapid Correction DTOs

// Potassium Mapper request
export const PotassiumMapper = {
  toRapidCorrection(dto: RapidCorrectionRequestDto): RapidPotassiumCorrectionRequest {
    const rawPatient = dto.patient;

    const patient: Patient = {
      weight: rawPatient.weight,
      age: dto.patient.age ?? undefined,
      sex: rawPatient.sex,
      venousAccess: rawPatient.accessType,
    };

    return {
      patient,
      doseMEqKg: potassiumHelper.parseDoseMEqKg(dto.doseMEqKg),
      infusionTimeHours: potassiumHelper.parseInfusionTimeHours(dto.infusionTimeHours),
      customDilutionFluidVolumeMl: potassiumHelper.parseOptionalNumber(
        dto.customDilutionFluidVolumeMl,
      ),
      selectedConcentrationMEqL: potassiumHelper.parseSelectedConcentrationMEqL(
        dto.selectedConcentrationMEqL,
      ),
      classification: dto.classification
        ? {
            status: dto.classification.status,
            severity: dto.classification.severity as any,
            kLevel: dto.classification.kLevel,
          }
        : undefined,
    };
  },

  /**
   * Transforms the domain response to a clean response DTO.
   */
  toRapidCorrectionResponseDto(
    domain: RapidPotassiumCorrectionResponse,
  ): RapidCorrectionResponseDto {
    return {
      classification: domain.classification
        ? {
            status: domain.classification.status,
            severity: domain.classification.severity,
            kLevel: domain.classification.kLevel,
          }
        : undefined,
      mEqRequired: domain.mEqRequired,
      mlClK: domain.mlClK,
      dilutionFluidVolumeMl: domain.dilutionFluidVolumeMl,
      totalVolumeMl: domain.totalVolumeMl,
      infusionRateMlPerHour: domain.infusionRateMlPerHour,
      flowMEqKgH: domain.flowMEqKgH,
      instructionText: domain.medicalOrder.instructionText,
    };
  },

  /**
   * Transforms the maintenance DTO to domain model.
   */
  toMaintenanceDomain(dto: PotassiumMaintenanceRequestDto): PotassiumMaintenanceRequest {
    const rawPatient = dto.patient;

    const patient: Patient = {
      weight: rawPatient.weight,
      age: rawPatient.age
        ? typeof rawPatient.age === 'string'
          ? parseInt(rawPatient.age, 10)
          : rawPatient.age
        : undefined,
      sex: rawPatient.sex,
    };

    return {
      patient,
      dailyRequirementMEqKg:
        typeof dto.dailyRequirementMEqKg === 'string'
          ? parseFloat(dto.dailyRequirementMEqKg)
          : dto.dailyRequirementMEqKg,
    };
  },

  /**
   * Transforms the maintenance domain response to DTO.
   */
  toMaintenanceResponseDto(domain: PotassiumMaintenanceResponse): PotassiumMaintenanceResponseDto {
    return {
      mEqRequired: domain.mEqRequired,
      mlClK: domain.mlClK,
      dailyContributionMEq: domain.dailyContributionMEq,
    };
  },
};
