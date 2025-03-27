import { ControlRule } from '../../automation/control-rule/entities';

export abstract class AsicsScaleStrategy {
  abstract run(rule: ControlRule): void;
}
