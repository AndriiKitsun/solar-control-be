import { ClassMock } from '@common/types/test.types';
import { ControlRuleRepository } from '@modules/automation/control-rule/control-rule.repository';
import { ControlRule } from '@modules/automation/control-rule/entities';
import { ControlRuleId } from '@modules/automation/control-rule/enums';
import { ControlRuleDto } from '@modules/automation/control-rule/dto';

export class ControlRuleRepositoryMock
  implements ClassMock<ControlRuleRepository>
{
  static readonly controlRuleMock: ControlRule = {
    id: ControlRuleId.DC_BATTERY_AVG_VOLTAGE,
    scaleUpValue: 100,
    scaleUpCheckTime: 180,
    scaleDownValue: 80,
    scaleDownCheckTime: 120,
  };

  getRules(): Promise<ControlRule[]> {
    return Promise.resolve([]);
  }

  async saveRule(
    id: ControlRuleId,
    ruleDto: ControlRuleDto,
  ): Promise<ControlRule> {
    return ControlRuleRepositoryMock.controlRuleMock;
  }
}
