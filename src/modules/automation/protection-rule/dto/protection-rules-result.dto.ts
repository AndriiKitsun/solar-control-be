import { ProtectionRuleId } from '../enums';

export class ProtectionRulesResultDto
  implements Record<ProtectionRuleId, boolean>
{
  acOutputFrequency = false;
  acOutputVoltage = false;
  acOutputAvgVoltage = false;
  dcBatteryAvgVoltage = false;
}
