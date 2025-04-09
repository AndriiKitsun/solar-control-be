import { Test } from '@nestjs/testing';
import { LogsService } from '@modules/logs/logs.service';
import { ProtectionStrategy } from '@modules/automation/protection-rule/strategies';
import { LogsServiceMock } from '../../../logs/mocks/logs.service.mock';
import { SensorItem } from '@modules/sensors/entities';
import {
  ProtectionRulesResult,
  ProtectionMappedRule,
} from '@modules/automation/protection-rule/protection-rule.types';
import { SensorId } from '@modules/sensors/enums';
import { ProtectionRuleRepositoryMock } from '../mocks/protection-rule.repository.mock';
import { LogType } from '@modules/logs/enums';
import { LogPayload } from '@modules/logs/logs.types';
import { ProtectionRuleId } from '@modules/automation/protection-rule/enums';
import { Injectable } from '@nestjs/common';

@Injectable()
class ProtectionStrategyMock extends ProtectionStrategy {
  readonly name: SensorId = SensorId.AC_INPUT;

  constructor(protected override readonly logsService: LogsService) {
    super(logsService);
  }

  run(sensor: SensorItem, rules: ProtectionMappedRule): ProtectionRulesResult {
    return {
      dcBatteryAvgVoltage: false,
    };
  }
}

describe('ProtectionStrategy', () => {
  let strategy: ProtectionStrategyMock;
  let logsService: LogsService;

  const { protectionRuleMock } = ProtectionRuleRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProtectionStrategyMock,
        {
          provide: LogsService,
          useClass: LogsServiceMock,
        },
      ],
    }).compile();

    strategy = module.get(ProtectionStrategyMock);
    logsService = module.get(LogsService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('logRule', () => {
    it('should log rule', () => {
      const infoSpy = jest.spyOn(logsService, 'info');
      const expectedPayload: LogPayload = {
        type: LogType.PROTECTION,
        message: `Protection rule '${ProtectionRuleId.AC_OUTPUT_VOLTAGE}' was triggered for '${SensorId.AC_INPUT}' sensor. Value: 123. Min: 180. Max: 240`,
      };

      strategy['logRule'](protectionRuleMock, 123);

      expect(infoSpy).toHaveBeenCalledWith(expectedPayload);
    });
  });
});
