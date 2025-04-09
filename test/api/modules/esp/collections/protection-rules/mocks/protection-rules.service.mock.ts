import { ClassMock } from '@common/types/test.types';
import {
  EspProtectionRulesApiService,
  EspProtectionRule,
} from '@api/modules/esp';
import { ProtectionRuleId } from '@modules/automation/protection-rule/enums';
import { ProtectionRuleDto } from '@modules/automation/protection-rule/dto';

export class EspProtectionRulesApiServiceMock
  implements ClassMock<EspProtectionRulesApiService>
{
  static readonly protectionRuleMock: EspProtectionRule = {
    id: ProtectionRuleId.AC_OUTPUT_VOLTAGE,
    min: 200,
    max: 240,
  };

  async saveProtectionRule(
    id: ProtectionRuleId,
    ruleDto: ProtectionRuleDto,
  ): Promise<void> {
    return;
  }
}
