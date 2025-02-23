import { Inject, Injectable } from '@nestjs/common';
import { SensorItem } from '../../sensors';
import { ProtectionRule } from '../entities';
import { ProtectionStrategy } from './protection.strategy';
import { PROTECTION_STRATEGY_CONFIG } from '../protection-rules.constants';
import { ProtectionRuleId } from '../enums';
import { EspSensorId } from '@api/modules/esp';

@Injectable()
export class ProtectionRulesExecutor {
  constructor(
    @Inject(PROTECTION_STRATEGY_CONFIG)
    private readonly strategyConfig: Record<EspSensorId, ProtectionStrategy>,
  ) {}

  async execute(sensors: SensorItem[], rules: ProtectionRule[]): Promise<void> {
    const mappedRules = rules.reduce(
      (acc, rule) => {
        acc[rule.id] = rule;

        return acc;
      },
      {} as Record<ProtectionRuleId, ProtectionRule>,
    );

    for (const sensor of sensors) {
      if (!sensor.name) {
        continue;
      }

      const selected = this.strategyConfig[sensor.name];

      if (!selected) {
        continue;
      }

      await selected.run(sensor, mappedRules);
    }
  }
}
