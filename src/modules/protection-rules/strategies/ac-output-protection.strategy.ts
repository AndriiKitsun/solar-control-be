import { Injectable } from '@nestjs/common';
import { ProtectionRuleId } from '../enums';
import { SensorItem, SensorId } from '../../sensors';
import { ProtectionStrategy } from './protection.strategy';
import { LogsService } from '../../logs';
import { ProtectionRule } from '../entities';
import { ProtectionRuleResult } from '../protection-rules.types';

@Injectable()
export class AcOutputProtectionStrategy extends ProtectionStrategy {
  readonly name: SensorId = SensorId.AC_OUTPUT;

  constructor(protected override readonly logsService: LogsService) {
    super(logsService);
  }

  run(
    sensor: SensorItem,
    rules: Record<ProtectionRuleId, ProtectionRule>,
  ): ProtectionRuleResult {
    const result: ProtectionRuleResult = {
      [ProtectionRuleId.AC_OUTPUT_FREQUENCY]: false,
      [ProtectionRuleId.AC_OUTPUT_VOLTAGE]: false,
      [ProtectionRuleId.AC_OUTPUT_AVG_VOLTAGE]: false,
    };

    if (sensor.protection?.acOutputFrequency && rules.acOutputFrequency) {
      this.logRule(rules.acOutputFrequency, sensor.frequency);

      result.acOutputFrequency = true;
    }

    if (sensor.protection?.acOutputVoltage && rules.acOutputVoltage) {
      this.logRule(rules.acOutputVoltage, sensor.voltage);

      result.acOutputVoltage = true;
    }

    if (this.checkRule(rules.acOutputAvgVoltage, sensor.avgVoltage)) {
      this.logRule(rules.acOutputAvgVoltage, sensor.avgVoltage);

      result.acOutputAvgVoltage = true;
    }

    return result;
  }
}
