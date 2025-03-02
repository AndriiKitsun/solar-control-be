import { ProtectionRuleParams } from '@modules/protection-rules/params';
import { ProtectionRuleId } from '@modules/protection-rules/enums';

export class ProtectionRuleParamsMock {
  static readonly protectionRuleParamsMock: ProtectionRuleParams = {
    id: ProtectionRuleId.AC_OUTPUT_VOLTAGE,
  };
}
