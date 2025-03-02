import { ClassMock } from '@common/types/test.types';
import { ProtectionRulesRepository } from '@modules/protection-rules/protection-rules.repository';
import { ProtectionRule } from '@modules/protection-rules/entities';
import { ProtectionRuleDto } from '@modules/protection-rules/dto';
import { ProtectionRuleId } from '@modules/protection-rules/enums';

export class ProtectionRulesRepositoryMock
  implements ClassMock<ProtectionRulesRepository>
{
  static readonly protectionRuleMock: ProtectionRule = {
    id: ProtectionRuleId.AC_OUTPUT_VOLTAGE,
    min: 180.3,
    max: 240,
    enabled: true,
  };

  static readonly protectionRulesMock: ProtectionRule[] = [
    this.protectionRuleMock,
  ];

  async getRules(): Promise<ProtectionRule[]> {
    return ProtectionRulesRepositoryMock.protectionRulesMock;
  }

  async getEnabledRules(): Promise<ProtectionRule[]> {
    return ProtectionRulesRepositoryMock.protectionRulesMock;
  }

  async saveRule(
    id: ProtectionRuleId,
    ruleDto: ProtectionRuleDto,
  ): Promise<ProtectionRule> {
    return ProtectionRulesRepositoryMock.protectionRuleMock;
  }
}
