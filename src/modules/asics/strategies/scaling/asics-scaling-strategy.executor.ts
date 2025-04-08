import { ControlRule } from '../../../automation/control-rule/entities';
import { Injectable } from '@nestjs/common';
import { ControlRuleId } from '../../../automation/control-rule/enums';
import { AsicsScalingUpStrategy } from './asics-scaling-up.strategy';
import { AsicsScalingDownStrategy } from './asics-scaling-down.strategy';
import { AsicsTimerConfig } from '../../types/asics.types';

@Injectable()
export class AsicsScalingStrategyExecutor {
  private config: AsicsTimerConfig = {
    [ControlRuleId.DC_BATTERY_AVG_VOLTAGE]: {},
  };

  constructor(
    private readonly asicsScalingUpStrategy: AsicsScalingUpStrategy,
    private readonly asicsScalingDownStrategy: AsicsScalingDownStrategy,
  ) {}

  execute(ruleOrRules: ControlRule | ControlRule[]): void {
    if (Array.isArray(ruleOrRules)) {
      ruleOrRules.forEach((rule) => {
        this.startScalingTimer(rule);
      });
    } else {
      this.startScalingTimer(ruleOrRules);
    }
  }

  startScalingTimer(rule: ControlRule): void {
    const scaleUpCb = (): void => {
      void this.asicsScalingUpStrategy.run(rule);
    };
    const scaleDownCb = (): void => {
      void this.asicsScalingDownStrategy.run(rule);
    };

    clearInterval(this.config[rule.id].scaleUp);
    clearInterval(this.config[rule.id].scaleDown);

    this.config[rule.id] = {
      scaleUp: setInterval(scaleUpCb, rule.scaleUpCheckTime * 1000),
      scaleDown: setInterval(scaleDownCb, rule.scaleDownCheckTime * 1000),
    };
  }
}
