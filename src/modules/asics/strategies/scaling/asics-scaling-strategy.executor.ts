import { ControlRule } from '../../../automation/control-rule/entities';
import { Injectable, Inject } from '@nestjs/common';
import { ControlRuleId } from '../../../automation/control-rule/enums';
import { AsicsScalingUpStrategy } from './asics-scaling-up.strategy';
import { AsicsScalingDownStrategy } from './asics-scaling-down.strategy';
import { AsicsTimerConfig } from '../../types/asics.types';
import { AppConfigType, AppConfig } from '@config/app.config';

@Injectable()
export class AsicsScalingStrategyExecutor {
  private config: AsicsTimerConfig = {
    [ControlRuleId.DC_BATTERY_AVG_VOLTAGE]: {},
  };

  constructor(
    private readonly asicsScalingUpStrategy: AsicsScalingUpStrategy,
    private readonly asicsScalingDownStrategy: AsicsScalingDownStrategy,
    @Inject(AppConfig.KEY)
    private readonly appConfig: AppConfigType,
  ) {}

  execute(ruleOrRules: ControlRule | ControlRule[]): void {
    if (!this.appConfig.feature.asicsControlEnabled) {
      return;
    }

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
