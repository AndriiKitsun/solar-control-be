import { SensorId } from '../../sensors/enums';
import { SensorItem } from '../../sensors/entities';
import { ProtectionRule } from '../entities';
import { LogsService } from '../../logs/logs.service';
import { LogType } from '../../logs/enums';
import { ProtectionRuleId } from '../enums';
import { ProtectionRuleResult } from '../protection-rules.types';

export abstract class ProtectionStrategy {
  abstract readonly name: SensorId;

  protected constructor(protected readonly logsService: LogsService) {}

  protected logRule(rule: ProtectionRule, value: number | undefined): void {
    return this.logsService.info({
      type: LogType.PROTECTION,
      message: `Protection rule '${rule.id}' was triggered for '${this.name}' sensor. Value: ${value}. Min: ${rule.min}. Max: ${rule.max}`,
    });
  }

  abstract run(
    sensor: SensorItem,
    rules: Record<ProtectionRuleId, ProtectionRule>,
  ): ProtectionRuleResult;
}
