import { Inject, Injectable } from '@nestjs/common';
import { SensorItem, SensorId } from '../../sensors';
import { ProtectionRule } from '../entities';
import { ProtectionStrategy } from './protection.strategy';
import { PROTECTION_STRATEGY_CONFIG } from '../protection-rules.constants';
import { ProtectionRuleId } from '../enums';

@Injectable()
export class ProtectionRulesExecutor {
  constructor(
    @Inject(PROTECTION_STRATEGY_CONFIG)
    private readonly strategyConfig: Record<SensorId, ProtectionStrategy>,
  ) {}

  execute(sensors: SensorItem[], rules: ProtectionRule[]): boolean {
    const mappedRules = rules.reduce(
      (acc, rule) => {
        acc[rule.id] = rule;

        return acc;
      },
      {} as Record<ProtectionRuleId, ProtectionRule>,
    );
    let result = false;

    for (const sensor of sensors) {
      if (!sensor.name) {
        continue;
      }

      const selected = this.strategyConfig[sensor.name];

      if (!selected) {
        continue;
      }

      const isActivated = selected.run(sensor, mappedRules);

      if (isActivated) {
        result = isActivated;
      }
    }

    return result;
  }
}
