import { ClassMock } from '@common/types/test.types';
import { ProtectionStrategyExecutor } from '@modules/automation/protection-rule/strategies/protection-strategy.executor';
import { ProtectionResultDto } from '@modules/automation/protection-rule/dto';
import { ProtectionRule } from '@modules/automation/protection-rule/entities';
import { Sensor } from '@modules/sensors/entities';

export class ProtectionStrategyExecutorMock
  implements ClassMock<ProtectionStrategyExecutor>
{
  static readonly protectionResultMock: ProtectionResultDto = {
    triggered: false,
    rules: {
      acOutputFrequency: false,
      acOutputVoltage: false,
      acOutputAvgVoltage: false,
      dcBatteryAvgVoltage: false,
    },
  };

  execute(sensors: Sensor, rules: ProtectionRule[]): ProtectionResultDto {
    return ProtectionStrategyExecutorMock.protectionResultMock;
  }
}
