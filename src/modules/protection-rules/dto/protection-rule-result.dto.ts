import { ProtectionRuleId } from '../enums';

export class ProtectionRuleResultDto
  implements Record<ProtectionRuleId, boolean>
{
  acOutputFrequency = false;
  acOutputVoltage = false;
  acOutputAvgVoltage = false;
  dcBatteryVoltage = false;
}
