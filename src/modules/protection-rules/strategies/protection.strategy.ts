import { ProtectionRuleId } from '../enums';
import { SensorItem } from '../../sensors';
import { ProtectionRule } from '../entities';

export abstract class ProtectionStrategy {
  abstract readonly name: string;

  protected abstract readonly allowedRules: ProtectionRuleId[];
  protected abstract readonly valueMapper: Record<
    string,
    (sensor: SensorItem) => number | undefined
  >;

  run(sensor: SensorItem, rules: ProtectionRule[]): boolean {
    return rules
      .filter((rule) => this.allowedRules.includes(rule.id))
      .some((rule) =>
        this.checkProtection(rule, this.valueMapper[rule.id]?.(sensor)),
      );
  }

  protected checkProtection(
    rule: ProtectionRule | undefined,
    value: number | undefined,
  ): boolean {
    if (!value || !rule?.min || !rule.max) {
      return false;
    }

    return value < rule.min || value > rule.max;
  }
}
