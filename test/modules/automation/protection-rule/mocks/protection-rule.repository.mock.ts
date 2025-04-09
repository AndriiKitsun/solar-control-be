import { ClassMock } from '@common/types/test.types';
import { ProtectionRuleRepository } from '@modules/automation/protection-rule/protection-rule.repository';
import { ProtectionRule } from '@modules/automation/protection-rule/entities';
import { ProtectionRuleDto } from '@modules/automation/protection-rule/dto';
import { ProtectionRuleId } from '@modules/automation/protection-rule/enums';

export class ProtectionRuleRepositoryMock
  implements ClassMock<ProtectionRuleRepository>
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
    return ProtectionRuleRepositoryMock.protectionRulesMock;
  }

  async getEnabledRules(): Promise<ProtectionRule[]> {
    return ProtectionRuleRepositoryMock.protectionRulesMock;
  }

  async saveRule(
    id: ProtectionRuleId,
    ruleDto: ProtectionRuleDto,
  ): Promise<ProtectionRule> {
    return ProtectionRuleRepositoryMock.protectionRuleMock;
  }
}
