import { Test } from '@nestjs/testing';
import { LogsService } from '@modules/logs/logs.service';
import { AcOutputProtectionStrategy } from '@modules/automation/protection-rule/strategies';
import { LogsServiceMock } from '../../../logs/mocks/logs.service.mock';
import { ProtectionRuleId } from '@modules/automation/protection-rule/enums';
import {
  ProtectionRulesResult,
  ProtectionMappedRule,
} from '@modules/automation/protection-rule/protection-rule.types';
import { EspSensor } from '@api/modules/esp';

describe('AcOutputProtectionStrategy', () => {
  let strategy: AcOutputProtectionStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AcOutputProtectionStrategy,
        {
          provide: LogsService,
          useClass: LogsServiceMock,
        },
      ],
    }).compile();

    strategy = module.get(AcOutputProtectionStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('run', () => {
    let logRuleSpy: jest.SpyInstance;

    beforeEach(() => {
      logRuleSpy = jest.spyOn(strategy as any, 'logRule').mockImplementation();
    });

    it('should log ac output frequency rule', () => {
      const sensorMock: EspSensor = {
        frequency: 123,
        protection: {
          acOutputFrequency: true,
        },
      };
      const rulesMock: ProtectionMappedRule = {
        [ProtectionRuleId.AC_OUTPUT_FREQUENCY]: {
          id: ProtectionRuleId.AC_OUTPUT_FREQUENCY,
          enabled: true,
          min: 49,
          max: 51,
        },
      };
      const expectedResult: ProtectionRulesResult = {
        acOutputFrequency: true,
        acOutputVoltage: false,
        acOutputAvgVoltage: false,
      };

      const result = strategy.run(sensorMock, rulesMock);

      expect(logRuleSpy).toHaveBeenCalledWith(
        rulesMock.acOutputFrequency,
        sensorMock.frequency,
      );

      expect(result).toEqual(expectedResult);
    });

    it('should log ac output voltage rule', () => {
      const sensorMock: EspSensor = {
        voltage: 123,
        protection: {
          acOutputVoltage: true,
        },
      };
      const rulesMock: ProtectionMappedRule = {
        [ProtectionRuleId.AC_OUTPUT_VOLTAGE]: {
          id: ProtectionRuleId.AC_OUTPUT_VOLTAGE,
          enabled: true,
          min: 49,
          max: 51,
        },
      };
      const expectedResult: ProtectionRulesResult = {
        acOutputFrequency: false,
        acOutputVoltage: true,
        acOutputAvgVoltage: false,
      };

      const result = strategy.run(sensorMock, rulesMock);

      expect(logRuleSpy).toHaveBeenCalledWith(
        rulesMock.acOutputVoltage,
        sensorMock.voltage,
      );

      expect(result).toEqual(expectedResult);
    });

    it('should log ac output average voltage rule', () => {
      const sensorMock: EspSensor = {
        avgVoltage: 123,
        protection: {
          acOutputAvgVoltage: true,
        },
      };
      const rulesMock: ProtectionMappedRule = {
        [ProtectionRuleId.AC_OUTPUT_AVG_VOLTAGE]: {
          id: ProtectionRuleId.AC_OUTPUT_AVG_VOLTAGE,
          enabled: true,
          min: 49,
          max: 51,
        },
      };
      const expectedResult: ProtectionRulesResult = {
        acOutputFrequency: false,
        acOutputVoltage: false,
        acOutputAvgVoltage: true,
      };

      const result = strategy.run(sensorMock, rulesMock);

      expect(logRuleSpy).toHaveBeenCalledWith(
        rulesMock.acOutputAvgVoltage,
        sensorMock.avgVoltage,
      );

      expect(result).toEqual(expectedResult);
    });
  });
});
