import { describe, it, expect } from 'vitest';
import { PotassiumMapper } from './potassium_mapper';
import {
  RapidPotassiumCorrectionResponse,
  PotassiumMaintenanceResponse,
} from '../models/potassium';

import { RapidCorrectionRequestDto, PotassiumMaintenanceRequestDto } from './models/Potassium';

describe('PotassiumMapper Unit Tests', () => {
  describe('toRapidCorrectionDomain', () => {
    it('should map valid numeric values correctly', () => {
      const dto: RapidCorrectionRequestDto = {
        patient: {
          weight: 12.5,
          age: 5,
          sex: 'male',
          accessType: 'peripheral',
        },
        doseMEqKg: 0.5,
        infusionTimeHours: 2,
        customDilutionFluidVolumeMl: 50,
        selectedConcentrationMEqL: 100,
      };

      const domain = PotassiumMapper.toRapidCorrection(dto);

      expect(domain.patient.weight).toBe(12.5);
      expect(domain.patient.age).toBe(5);
      expect(domain.patient.sex).toBe('male');
      expect(domain.patient.venousAccess).toBe('peripheral');
      expect(domain.doseMEqKg).toBe(0.5);
      expect(domain.infusionTimeHours).toBe(2);
      expect(domain.customDilutionFluidVolumeMl).toBe(50);
      expect(domain.selectedConcentrationMEqL).toBe(100);
    });

    it('should parse string representations of numbers to appropriate types', () => {
      const dto: RapidCorrectionRequestDto = {
        patient: {
          weight: 10,
          age: 6,
          sex: 'female',
          accessType: 'peripheral',
        },
        doseMEqKg: '0.5',
        infusionTimeHours: '2',
        customDilutionFluidVolumeMl: '80',
        selectedConcentrationMEqL: '40',
      };

      const domain = PotassiumMapper.toRapidCorrection(dto);

      expect(domain.patient.weight).toBe(10);
      expect(domain.patient.age).toBe(6);
      expect(domain.doseMEqKg).toBe(0.5);
      expect(domain.infusionTimeHours).toBe(2);
      expect(domain.customDilutionFluidVolumeMl).toBe(80);
      expect(domain.selectedConcentrationMEqL).toBe(40);
    });
  });

  describe('toRapidCorrectionResponseDto', () => {
    it('should map domain response to a clean response DTO', () => {
      const domainResponse: RapidPotassiumCorrectionResponse = {
        patient: { weight: 10 },
        classification: {
          status: 'hipokalemia',
          severity: 'moderada',
          kLevel: 2.7,
        },
        mEqRequired: 5,
        mlClK: 1.67,
        dilutionFluidVolumeMl: 40,
        totalVolumeMl: 41.67,
        infusionRateMlPerHour: 20.84,
        flowMEqKgH: 0.25,
        steps: [],
        alerts: [],
        medicalOrder: {
          solutionVolumeMl: 40,
          electrolyteVolumeMl: 1.67,
          totalVolumeMl: 41.67,
          infusionRateMlPerHour: 20.84,
          durationHours: 2,
          instructionText: 'Administer 5 mEq of Potassium...',
        },
      };

      const dto = PotassiumMapper.toRapidCorrectionResponseDto(domainResponse);

      expect(dto.classification).toEqual({
        status: 'hipokalemia',
        severity: 'moderada',
        kLevel: 2.7,
      });
      expect(dto.mEqRequired).toBe(5);
      expect(dto.mlClK).toBe(1.67);
      expect(dto.dilutionFluidVolumeMl).toBe(40);
      expect(dto.totalVolumeMl).toBe(41.67);
      expect(dto.infusionRateMlPerHour).toBe(20.84);
      expect(dto.flowMEqKgH).toBe(0.25);
      expect(dto.instructionText).toBe('Administer 5 mEq of Potassium...');
    });
  });

  describe('toMaintenanceDomain', () => {
    it('should map maintenance request correctly', () => {
      const dto: PotassiumMaintenanceRequestDto = {
        patient: {
          weight: 12,
          age: 3,
        },
        dailyRequirementMEqKg: '3.5',
      };

      const domain = PotassiumMapper.toMaintenanceDomain(dto);

      expect(domain.patient.weight).toBe(12);
      expect(domain.patient.age).toBe(3);
      expect(domain.dailyRequirementMEqKg).toBe(3.5);
    });
  });

  describe('toMaintenanceResponseDto', () => {
    it('should map maintenance response correctly', () => {
      const domainResponse: PotassiumMaintenanceResponse = {
        patient: { weight: 12 },
        mEqRequired: 42,
        mlClK: 14,
        dailyContributionMEq: 42,
        steps: [],
      };

      const dto = PotassiumMapper.toMaintenanceResponseDto(domainResponse);

      expect(dto.mEqRequired).toBe(42);
      expect(dto.mlClK).toBe(14);
      expect(dto.dailyContributionMEq).toBe(42);
    });
  });
});
