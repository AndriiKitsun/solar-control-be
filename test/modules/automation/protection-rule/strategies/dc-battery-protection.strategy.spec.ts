import { Test } from '@nestjs/testing';
import { LogsService } from '@modules/logs/logs.service';
import { DcBatteryProtectionStrategy } from '@modules/automation/protection-rule/strategies';
import { LogsServiceMock } from '../../../logs/mocks/logs.service.mock';
import { ProtectionRuleId } from '@modules/automation/protection-rule/enums';
import {
  ProtectionRulesResult,
  ProtectionMappedRule,
} from '@modules/automation/protection-rule/protection-rule.types';
import { EspSensor } from '@api/modules/esp';

describe('DcBatteryProtectionStrategy', () => {
  let strategy: DcBatteryProtectionStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DcBatteryProtectionStrategy,
        {
          provide: LogsService,
          useClass: LogsServiceMock,
        },
      ],
    }).compile();

    strategy = module.get(DcBatteryProtectionStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('run', () => {
    let logRuleSpy: jest.SpyInstance;

    beforeEach(() => {
      logRuleSpy = jest.spyOn(strategy as any, 'logRule').mockImplementation();
    });

    it('should log ac output average voltage rule', () => {
      const sensorMock: EspSensor = {
        avgVoltage: 123,
        protection: {
          dcBatteryAvgVoltage: true,
        },
      };
      const rulesMock: ProtectionMappedRule = {
        [ProtectionRuleId.DC_BATTERY_AVG_VOLTAGE]: {
          id: ProtectionRuleId.DC_BATTERY_AVG_VOLTAGE,
          enabled: true,
          min: 49,
          max: 51,
        },
      };
      const expectedResult: ProtectionRulesResult = {
        dcBatteryAvgVoltage: true,
      };

      const result = strategy.run(sensorMock, rulesMock);

      expect(logRuleSpy).toHaveBeenCalledWith(
        rulesMock.dcBatteryAvgVoltage,
        sensorMock.avgVoltage,
      );

      expect(result).toEqual(expectedResult);
    });
  });
});
