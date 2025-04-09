import { AsicsScalingStrategy } from '@modules/asics/strategies';
import { ControlRule } from '@modules/automation/control-rule/entities';

export class AsicsScalingDownStrategyMock
  implements Pick<AsicsScalingStrategy, 'run'>
{
  async run(rule: ControlRule): Promise<void> {
    return;
  }
}
