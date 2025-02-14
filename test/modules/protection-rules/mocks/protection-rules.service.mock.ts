import { ClassMock } from '@common/types/test.types';
import {
  ProtectionRulesService,
  ProtectionRule,
  ProtectionRuleDto,
} from '@modules/protection-rules';
import { ProtectionRulesRepositoryMock } from './protection-rules.repository.mock';

export class ProtectionRulesServiceMock
  implements ClassMock<ProtectionRulesService>
{
  async saveRule(
    protectionRuleDto: ProtectionRuleDto,
  ): Promise<ProtectionRule> {
    return ProtectionRulesRepositoryMock.protectionRuleMock;
  }

  async getRules(): Promise<ProtectionRule[]> {
    return ProtectionRulesRepositoryMock.protectionRulesMock;
  }
}
