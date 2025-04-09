import { ControlRuleDto } from '@modules/automation/control-rule/dto';

export class ControlRuleDtoMock {
  static readonly controlRuleDtoMock: ControlRuleDto = {
    scaleUpCheckTime: 111,
    scaleUpValue: 100,
    scaleDownCheckTime: 111,
    scaleDownValue: 111,
  };
}
