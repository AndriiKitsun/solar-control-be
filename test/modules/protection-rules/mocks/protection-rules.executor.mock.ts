import { ClassMock } from '@common/types/test.types';
import { ProtectionRulesExecutor } from '@modules/protection-rules/protection-rules.executor';
import { ProtectionResultDto } from '@modules/protection-rules/dto';
import { ProtectionRule } from '@modules/protection-rules/entities';
import { SensorItem } from '@modules/sensors/entities';

export class ProtectionRulesExecutorMock
  implements ClassMock<ProtectionRulesExecutor>
{
  static readonly protectionResultMock: ProtectionResultDto = {
    triggered: false,
    rules: {
      acOutputFrequency: false,
      acOutputVoltage: false,
      acOutputAvgVoltage: false,
      dcBatteryVoltage: false,
    },
  };

  execute(sensors: SensorItem[], rules: ProtectionRule[]): ProtectionResultDto {
    return ProtectionRulesExecutorMock.protectionResultMock;
  }
}
