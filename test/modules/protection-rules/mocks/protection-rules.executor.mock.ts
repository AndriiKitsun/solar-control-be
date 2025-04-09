import { ClassMock } from '@common/types/test.types';
import { ProtectionRuleExecutor } from '@modules/automation/protection-rule/protection-rule.executor';
import { ProtectionResultDto } from '@modules/automation/protection-rule/dto';
import { ProtectionRule } from '@modules/automation/protection-rule/entities';
import { Sensor } from '@modules/sensors/entities';

export class ProtectionRulesExecutorMock
  implements ClassMock<ProtectionRuleExecutor>
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
    return ProtectionRulesExecutorMock.protectionResultMock;
  }
}
