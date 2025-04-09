import { ClassMock } from '@common/types/test.types';
import { ControlRuleService } from '@modules/automation/control-rule/control-rule.service';
import { ControlRule } from '@modules/automation/control-rule/entities';
import { ControlRuleId } from '@modules/automation/control-rule/enums';
import { ControlRuleDto } from '@modules/automation/control-rule/dto';
import { ControlRuleRepositoryMock } from './control-rule.repository.mock';

export class ControlRuleServiceMock implements ClassMock<ControlRuleService> {
  async getRules(): Promise<ControlRule[]> {
    return ControlRuleRepositoryMock.controlRulesMock;
  }

  async saveRule(
    id: ControlRuleId,
    ruleDto: ControlRuleDto,
  ): Promise<ControlRule> {
    return ControlRuleRepositoryMock.controlRuleMock;
  }
}
