import { ControlRule } from '../../../automation/control-rule/entities';
import { Injectable } from '@nestjs/common';
import { AsicsScalingConfig } from '../../types/asics.types';
import { ControlRuleId } from '../../../automation/control-rule/enums';
import { AsicsScaleUpStrategy } from './asics-scale-up.strategy';
import { AsicsScaleDownStrategy } from './asics-scale-down.strategy';
import { LogsService } from '../../../logs/logs.service';

@Injectable()
export class AsicsScalingStrategyExecutor {
  private config: AsicsScalingConfig = {
    timer: {
      [ControlRuleId.DC_BATTERY_AVG_VOLTAGE]: {},
    },
  };

  constructor(
    private readonly asicScaleUpStrategy: AsicsScaleUpStrategy,
    private readonly asicScaleDownStrategy: AsicsScaleDownStrategy,
    private readonly logsService: LogsService,
  ) {}

  execute(rules: ControlRule[] | ControlRule): void {
    if (Array.isArray(rules)) {
      rules.forEach((rule) => {
        this.startScalingTimer(rule);
      });
    } else {
      this.startScalingTimer(rules);
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

  // private scaleAsic(rule: ControlRule): Promise<void> {
  //   this.logsService.runWith(() => this.asicScaleUpStrategy.run(rule), {
  //     before: {
  //       type: LogType.CONTROL,
  //       message: 'Checking asics',
  //     },
  //     after: {
  //       type: LogType.CONTROL,
  //       message: '',
  //     },
  //   });
  // }
}
