import { ClassMock } from '@common/types/test.types';
import {
  EspProtectionRulesApiService,
  EspProtectionRule,
} from '@api/modules/esp';
import { ProtectionRuleId } from '@modules/protection-rules/enums';

export class EspProtectionRulesApiServiceMock
  implements ClassMock<EspProtectionRulesApiService>
{
  static readonly protectionRuleMock: EspProtectionRule = {
    id: ProtectionRuleId.AC_OUTPUT_VOLTAGE,
    min: 200,
    max: 240,
  };

  async saveProtectionRule(rule: EspProtectionRule): Promise<void> {
    return;
  }
}
