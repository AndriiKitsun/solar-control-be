import { Inject, Injectable } from '@nestjs/common';
import { Sensor } from '../../../sensors/entities';
import { ProtectionRule } from '../entities';
import { PROTECTION_STRATEGY_CONFIG } from '../protection-rule.constants';
import { ProtectionResultDto } from '../dto';
import {
  ProtectionMappedRule,
  ProtectionStrategyConfig,
} from '../protection-rule.types';

@Injectable()
export class ProtectionStrategyExecutor {
  constructor(
    @Inject(PROTECTION_STRATEGY_CONFIG)
    private readonly strategyConfig: ProtectionStrategyConfig,
  ) {}

  execute(sensor: Sensor, rules: ProtectionRule[]): ProtectionResultDto {
    const mappedRules = rules.reduce((acc, rule) => {
      acc[rule.id] = rule;

      return acc;
    }, {} as ProtectionMappedRule);
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
