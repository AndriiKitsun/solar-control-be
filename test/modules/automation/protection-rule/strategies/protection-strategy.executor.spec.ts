import { Test } from '@nestjs/testing';
import { ProtectionStrategyExecutor } from '@modules/automation/protection-rule/strategies';
import { PROTECTION_STRATEGY_CONFIG } from '@modules/automation/protection-rule/protection-rule.constants';
import { ProtectionStrategyMock } from './mocks/protection-strategy.mock';
import { ProtectionRuleRepositoryMock } from '../mocks/protection-rule.repository.mock';
import { ProtectionResultDto } from '@modules/automation/protection-rule/dto';
import { ProtectionMappedRule } from '@modules/automation/protection-rule/protection-rule.types';
import { ProtectionRuleId } from '@modules/automation/protection-rule/enums';
import { EspSensorId, EspSensorsData, EspSensor } from '@api/modules/esp';

describe('ProtectionStrategyExecutor', () => {
  let executor: ProtectionStrategyExecutor;

  const strategyMock = new ProtectionStrategyMock();
  const configMock: Partial<Record<EspSensorId, ProtectionStrategyMock>> = {
    [EspSensorId.AC_INPUT]: strategyMock,
  };

  const { protectionRulesMock, protectionRuleMock } =
    ProtectionRuleRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProtectionStrategyExecutor,
        {
          provide: PROTECTION_STRATEGY_CONFIG,
          useValue: configMock,
        },
      ],
    }).compile();

    executor = module.get(ProtectionStrategyExecutor);
  });

  it('should be defined', () => {
    expect(executor).toBeDefined();
  });

  describe('execute', () => {
    let runSpy: jest.SpiedFunction<ProtectionStrategyMock['run']>;

    beforeEach(() => {
      runSpy = jest.spyOn(strategyMock, 'run');
    });

    it('should not run strategy if sensor does not have name', () => {
      const sensorMock = {
        pTriggered: false,
        sensors: [
          {
            voltage: 123,
          },
        ],
      } as EspSensorsData;
      const expectedResult: ProtectionResultDto = {
        triggered: false,
        rules: {
          acOutputAvgFrequency: false,
          acOutputVoltage: false,
          acOutputAvgVoltage: false,
          dcBatteryAvgVoltage: false,
        },
      };

      const result = executor.execute(sensorMock, protectionRulesMock);

      expect(runSpy).not.toHaveBeenCalled();

      expect(result).toEqual(expectedResult);
    });

    it('should not run strategy it not found', () => {
      const sensorMock = {
        pTriggered: false,
        sensors: [
          {
            name: EspSensorId.AC_OUTPUT,
            voltage: 123,
          },
        ],
      } as EspSensorsData;
      const expectedResult: ProtectionResultDto = {
        triggered: false,
        rules: {
          acOutputAvgFrequency: false,
          acOutputVoltage: false,
          acOutputAvgVoltage: false,
          dcBatteryAvgVoltage: false,
        },
      };

      const result = executor.execute(sensorMock, protectionRulesMock);

      expect(runSpy).not.toHaveBeenCalled();

      expect(result).toEqual(expectedResult);
    });

    it('should run protection strategy', () => {
      const sensorItemMock = {
        name: EspSensorId.AC_INPUT,
        voltage: 123,
      } as EspSensor;
      const sensorMock = {
        pTriggered: true,
        sensors: [sensorItemMock],
      } as EspSensorsData;
      const expectedRules: ProtectionMappedRule = {
        [ProtectionRuleId.AC_OUTPUT_VOLTAGE]: protectionRuleMock,
      };
      const expectedResult: ProtectionResultDto = {
        triggered: true,
        rules: {
          acOutputAvgFrequency: false,
          acOutputVoltage: false,
          acOutputAvgVoltage: true,
          dcBatteryAvgVoltage: false,
        },
      };

      const result = executor.execute(sensorMock, protectionRulesMock);

      expect(runSpy).toHaveBeenCalledWith(sensorItemMock, expectedRules);

      expect(result).toEqual(expectedResult);
    });
  });
});
