import { ProtectionRuleId } from '../enums';
import { SensorItem, SensorId } from '../../sensors';
import { ProtectionRule } from '../entities';
import { LogDto, LogType, LogsService } from '../../logs';

export abstract class ProtectionStrategy {
  abstract readonly name: SensorId;

  protected abstract readonly allowedRules: ProtectionRuleId[];
  protected abstract readonly valueMapper: Record<
    string,
    (sensor: SensorItem) => number | undefined
  >;

  protected constructor(protected readonly logsService: LogsService) {}

  async run(
    sensor: SensorItem,
    rules: Record<ProtectionRuleId, ProtectionRule>,
  ): Promise<void> {
    for (const id of this.allowedRules) {
      const rule = rules[id];
      const value = this.valueMapper[id]?.(sensor);

      const result = this.checkRule(rule, value);

      if (!result) {
        continue;
      }

      await this.logsService.saveLog(
        this.prepareLog(rule, sensor.name!, value!),
      );
    }
  }

  protected checkRule(
    rule: ProtectionRule | undefined,
    value: number | undefined,
  ): boolean {
    if (!value || !rule?.min || !rule.max) {
      return false;
    }

    return value < rule.min || value > rule.max;
  }

  protected prepareLog(
    rule: ProtectionRule,
    name: string,
    value: number,
  ): LogDto {
    return {
      type: LogType.PROTECTION,
      message: `Rule '${rule.id}' was triggered for '${name}' sensor. Value: ${value}. Min: ${rule.min}. Min: ${rule.max}`,
    };
  }
}
