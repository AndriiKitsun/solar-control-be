import { Inject, Injectable } from '@nestjs/common';
import { SensorItem } from '../../sensors';
import { ProtectionRule } from '../entities';
import { ProtectionStrategy } from './protection.strategy';
import { PROTECTION_STRATEGIES } from '../protection-rules.constants';

@Injectable()
export class ProtectionRulesExecutor {
  constructor(
    @Inject(PROTECTION_STRATEGIES)
    private readonly protectionStrategies: ProtectionStrategy[],
  ) {}

  execute(sensors: SensorItem[], rules: ProtectionRule[]): void {
    for (const sensor of sensors) {
      if (!sensor.name) {
        continue;
      }

      const selected = this.protectionStrategies.find(
        (strategy) => strategy.name === sensor.name,
      );

      if (!selected) {
        continue;
      }

      selected.run(sensor, rules);
    }
  }
}
