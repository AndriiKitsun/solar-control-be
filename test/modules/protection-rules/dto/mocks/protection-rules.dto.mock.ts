import { ProtectionRuleDto } from '@modules/protection-rules';
import {
  ProtectionRuleId,
  ProtectionActionId,
} from '@modules/protection-rules/enums';

export class ProtectionRuleDtoMock {
  static readonly protectionRuleDtoMock: ProtectionRuleDto = {
    id: ProtectionRuleId.AC_OUTPUT_VOLTAGE,
    min: 180.3,
    max: 240,
    actions: [ProtectionActionId.POWER_OFF],
  };
}
