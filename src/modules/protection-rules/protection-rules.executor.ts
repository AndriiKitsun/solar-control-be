import { Inject, Injectable } from '@nestjs/common';
import { SensorId } from '../sensors/enums';
import { SensorItem } from '../sensors/entities';
import { ProtectionRule } from './entities';
import { ProtectionStrategy } from './strategies';
import { PROTECTION_STRATEGY_CONFIG } from './protection-rules.constants';
import { ProtectionRuleId } from './enums';
import { ProtectionResultDto } from './dto';

@Injectable()
export class ProtectionRulesExecutor {
  constructor(
    @Inject(PROTECTION_STRATEGY_CONFIG)
    private readonly strategyConfig: Record<SensorId, ProtectionStrategy>,
  ) {}

  execute(sensors: SensorItem[], rules: ProtectionRule[]): ProtectionResultDto {
    const mappedRules = rules.reduce(
      (acc, rule) => {
        acc[rule.id] = rule;

        return acc;
      },
      {} as Record<ProtectionRuleId, ProtectionRule>,
    );
    const result = new ProtectionResultDto();

    for (const sensor of sensors) {
      if (!sensor.name) {
        continue;
      }

      const selected = this.strategyConfig[sensor.name];

      if (!selected) {
        continue;
      }

      const strategyResult = selected.run(sensor, mappedRules);

      Object.assign(result.rules, strategyResult);
    }

    result.triggered = Object.values(result.rules).some(Boolean);

    return result;
  }
}
