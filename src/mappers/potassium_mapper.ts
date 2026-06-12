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
            severity: dto.classification.severity,
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
    const {
      alerts,
      classification,
      mEqRequired,
      mlClK,
      dilutionFluidVolumeMl,
      totalVolumeMl,
      infusionRateMlPerHour,
      flowMEqKgH,
      medicalOrder,
    } = domain;
    return {
      classification: classification
        ? {
            status: classification.status,
            severity: classification.severity,
            kLevel: classification.kLevel,
          }
        : undefined,
      mEqRequired,
      mlClK,
      dilutionFluidVolumeMl,
      totalVolumeMl,
      infusionRateMlPerHour,
      flowMEqKgH,
      instructionText: medicalOrder.instructionText,
      alerts,
    };
  },

  /**
   * Transforms the maintenance DTO to domain model.
   */
  toMaintenanceDomain(dto: PotassiumMaintenanceRequestDto): PotassiumMaintenanceRequest {
    const rawPatient = dto.patient;

    const patient: Patient = {
      weight: rawPatient.weight,
      venousAccess: rawPatient.accessType,
    };

    return {
      patient,
      dailyRequirementMEqKg:
        typeof dto.dailyRequirementMEqKg === 'string'
          ? parseFloat(dto.dailyRequirementMEqKg)
          : dto.dailyRequirementMEqKg,
      infusionTimeHours: potassiumHelper.parseOptionalNumber(dto.infusionTimeHours),
      selectedConcentrationMEqL: potassiumHelper.parseOptionalNumber(dto.selectedConcentrationMEqL),
      customDilutionFluidVolumeMl: potassiumHelper.parseOptionalNumber(
        dto.customDilutionFluidVolumeMl,
      ),
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
      dilutionFluidVolumeMl: domain.dilutionFluidVolumeMl,
      totalVolumeMl: domain.totalVolumeMl,
      infusionRateMlPerHour: domain.infusionRateMlPerHour,
      instructionText: domain.medicalOrder?.instructionText,
      alerts: domain.alerts,
    };
  },
};
