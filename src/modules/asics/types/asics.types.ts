import { ControlRuleId } from '../../automation/control-rule/enums';

interface AsicsScalingTimerConfig {
  scaleUp?: NodeJS.Timeout;
  scaleDown?: NodeJS.Timeout;
}

export type AsicsTimerConfig = Record<ControlRuleId, AsicsScalingTimerConfig>;
