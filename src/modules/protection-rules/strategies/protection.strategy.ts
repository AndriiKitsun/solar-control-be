import { SensorId, SensorItem } from '../../sensors';
import { ProtectionRule } from '../entities';
import { LogType, LogsService } from '../../logs';
import { ProtectionRuleId } from '../enums';

export abstract class ProtectionStrategy {
  abstract readonly name: SensorId;

  protected constructor(protected readonly logsService: LogsService) {}

  protected checkRule(
    rule: ProtectionRule | undefined,
    value: number | undefined,
  ): boolean {
    if (!value || !rule?.min || !rule.max) {
      return false;
    }

    return value < rule.min || value > rule.max;
  }

  protected logRule(rule: ProtectionRule, value: number | undefined): void {
    return this.logsService.info({
      type: LogType.PROTECTION,
      message: `Rule '${rule.id}' was triggered for '${this.name}' sensor. Value: ${value}. Min: ${rule.min}. Max: ${rule.max}`,
    });
  }

  abstract run(
    sensor: SensorItem,
    rules: Record<ProtectionRuleId, ProtectionRule>,
  ): boolean;
}
