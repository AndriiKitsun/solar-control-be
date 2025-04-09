import { ControlRuleParams } from '@modules/automation/control-rule/params';
import { ControlRuleId } from '@modules/automation/control-rule/enums';

export class ControlRuleParamsMock {
  static readonly controlRuleParamsMock: ControlRuleParams = {
    id: ControlRuleId.DC_BATTERY_AVG_VOLTAGE,
  };
}
