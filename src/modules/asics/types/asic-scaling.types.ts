import { ControlRule } from '../../automation/control-rule/entities';

export interface AsicsScaleStrategy {
  run(rule: ControlRule): Promise<void>;
}
