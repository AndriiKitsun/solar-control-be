import { ProtectionRule } from '../entities';
import { LogsService } from '../../../logs/logs.service';
import {
  ProtectionRulesResult,
  ProtectionMappedRule,
} from '../protection-rule.types';
import { LogType } from '../../../logs/enums';
import { EspSensor, EspSensorId } from '@api/modules/esp';

export abstract class ProtectionStrategy {
  abstract readonly name: EspSensorId;

  protected constructor(protected readonly logsService: LogsService) {}

  protected logRule(rule: ProtectionRule, value: number | undefined): void {
    return this.logsService.info({
      type: LogType.PROTECTION,
      message: `Protection rule '${rule.id}' was triggered for '${this.name}' sensor. Value: ${value}. Min: ${rule.min}. Max: ${rule.max}`,
    });
  }

  abstract run(
    sensor: EspSensor,
    rules: ProtectionMappedRule,
  ): ProtectionRulesResult;
}
