import { Expose } from 'class-transformer';
import { ProtectionRuleId } from '../../automation/protection-rule/enums';

export class SensorProtection
  implements Partial<Record<ProtectionRuleId, boolean>>
{
  @Expose()
  acOutputFrequency?: boolean;

  @Expose()
  acOutputVoltage?: boolean;

  @Expose()
  acOutputAvgVoltage?: boolean;

  @Expose()
  dcBatteryAvgVoltage?: boolean;
}
