import { ClassMock } from '@common/types/test.types';
import {
  ProtectionRulesRepository,
  ProtectionRule,
  ProtectionRuleDto,
} from '@modules/protection-rules';
import {
  ProtectionRuleId,
  ProtectionActionId,
} from '@modules/protection-rules/enums';

export class ProtectionRulesRepositoryMock
  implements ClassMock<ProtectionRulesRepository>
{
  static readonly protectionRuleMock: ProtectionRule = {
    id: ProtectionRuleId.AC_OUTPUT_VOLTAGE,
    min: 180.3,
    max: 240,
    actions: [ProtectionActionId.POWER_OFF],
  };

  static readonly protectionRulesMock: ProtectionRule[] = [
    this.protectionRuleMock,
  ];

  async saveRule(
    protectionRuleDto: ProtectionRuleDto,
  ): Promise<ProtectionRule> {
    return ProtectionRulesRepositoryMock.protectionRuleMock;
  }

  async getRules(): Promise<ProtectionRule[]> {
    return ProtectionRulesRepositoryMock.protectionRulesMock;
  }
}
