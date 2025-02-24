import { ClassMock } from '@common/types/test.types';
import {
  ProtectionRulesExecutor,
  ProtectionRule,
  ProtectionResultDto,
} from '@modules/protection-rules';
import { SensorItem } from '@modules/sensors';

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
