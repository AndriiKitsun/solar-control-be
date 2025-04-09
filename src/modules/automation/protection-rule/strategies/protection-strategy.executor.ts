import { Inject, Injectable } from '@nestjs/common';
import { SensorId } from '../../../sensors/enums';
import { Sensor } from '../../../sensors/entities';
import { ProtectionRule } from '../entities';
import { ProtectionStrategy } from './index';
import { PROTECTION_STRATEGY_CONFIG } from '../protection-rule.constants';
import { ProtectionRuleId } from '../enums';
import { ProtectionResultDto } from '../dto';

@Injectable()
export class ProtectionStrategyExecutor {
  constructor(
    @Inject(PROTECTION_STRATEGY_CONFIG)
    private readonly strategyConfig: Record<SensorId, ProtectionStrategy>,
  ) {}

  execute(sensor: Sensor, rules: ProtectionRule[]): ProtectionResultDto {
    const mappedRules = rules.reduce(
      (acc, rule) => {
        acc[rule.id] = rule;

        return acc;
      },
      {} as Record<ProtectionRuleId, ProtectionRule>,
    );
    const result = new ProtectionResultDto();

    for (const sensorItem of sensor.sensors) {
      if (!sensorItem.name) {
        continue;
      }

      const selected = this.strategyConfig[sensorItem.name];

      if (!selected) {
        continue;
      }

      const strategyResult = selected.run(sensorItem, mappedRules);

      Object.assign(result.rules, strategyResult);
    }

    result.triggered = sensor.pTriggered;

    return result;
  }
}
