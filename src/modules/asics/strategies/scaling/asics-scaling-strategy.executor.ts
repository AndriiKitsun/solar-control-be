import { ControlRule } from '../../../automation/control-rule/entities';
import { Injectable } from '@nestjs/common';
import { AsicsScalingConfig } from '../../types/asics.types';
import { ControlRuleId } from '../../../automation/control-rule/enums';
import { AsicsScalingUpStrategy } from './asics-scaling-up.strategy';
import { AsicsScalingDownStrategy } from './asics-scaling-down.strategy';

@Injectable()
export class AsicsScalingStrategyExecutor {
  private config: AsicsScalingConfig = {
    timer: {
      [ControlRuleId.DC_BATTERY_AVG_VOLTAGE]: {},
    },
  };

  constructor(
    private readonly asicScaleUpStrategy: AsicsScalingUpStrategy,
    private readonly asicScaleDownStrategy: AsicsScalingDownStrategy,
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

  private startScalingTimer(rule: ControlRule): void {
    const scaleUpCb = (): void => {
      void this.asicScaleUpStrategy.run(rule);
    };
    const scaleDownCb = (): void => {
      void this.asicScaleDownStrategy.run(rule);
    };

    clearInterval(this.config.timer[rule.id].scaleUp);
    clearInterval(this.config.timer[rule.id].scaleDown);

    this.config.timer[rule.id] = {
      scaleUp: setInterval(scaleUpCb, rule.scaleUpCheckTime * 1000),
      scaleDown: setInterval(scaleDownCb, rule.scaleDownCheckTime * 1000),
    };
  }
}
