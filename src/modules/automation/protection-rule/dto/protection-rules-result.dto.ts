import { ProtectionRuleId } from '../enums';

export class ProtectionRulesResultDto
  implements Record<ProtectionRuleId, boolean>
{
  acOutputAvgFrequency = false;
  acOutputVoltage = false;
  acOutputAvgVoltage = false;
  dcBatteryAvgVoltage = false;
}
