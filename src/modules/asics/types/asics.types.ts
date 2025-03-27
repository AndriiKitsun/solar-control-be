import { ControlRuleId } from '../../automation/control-rule/enums';

interface AsicsScalingTimerConfig {
  scaleUp?: NodeJS.Timeout;
  scaleDown?: NodeJS.Timeout;
}

export interface AsicsScalingConfig {
  timer: Record<ControlRuleId, AsicsScalingTimerConfig>;
}
