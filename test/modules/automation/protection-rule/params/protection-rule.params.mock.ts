import { ProtectionRuleParams } from '@modules/automation/protection-rule/params';
import { ProtectionRuleId } from '@modules/automation/protection-rule/enums';

export class ProtectionRuleParamsMock {
  static readonly protectionRuleParamsMock: ProtectionRuleParams = {
    id: ProtectionRuleId.AC_OUTPUT_VOLTAGE,
  };
}
