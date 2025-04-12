import { ClassMock } from '@common/types/test.types';
import { AsicsScalingStrategyExecutor } from '@modules/asics/strategies';
import { ControlRule } from '@modules/automation/control-rule/entities';

export class AsicsScalingStrategyExecutorMock
  implements ClassMock<AsicsScalingStrategyExecutor>
{
  execute(ruleOrRules: ControlRule | ControlRule[]): void {}

  startScalingTimer(rule: ControlRule): void {}
}
