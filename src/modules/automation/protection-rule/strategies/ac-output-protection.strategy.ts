import { Injectable } from '@nestjs/common';
import { ProtectionStrategy } from './protection.strategy';
import { LogsService } from '../../../logs/logs.service';
import {
  ProtectionRulesResult,
  ProtectionMappedRule,
} from '../protection-rule.types';
import { EspSensor, EspSensorId } from '@api/modules/esp';

@Injectable()
export class AcOutputProtectionStrategy extends ProtectionStrategy {
  readonly name = EspSensorId.AC_OUTPUT;

  constructor(protected override readonly logsService: LogsService) {
    super(logsService);
  }

  run(sensor: EspSensor, rules: ProtectionMappedRule): ProtectionRulesResult {
    const result: ProtectionRulesResult = {
      acOutputAvgFrequency: false,
      acOutputVoltage: false,
      acOutputAvgVoltage: false,
    };

    if (sensor.protection?.acOutputAvgFrequency && rules.acOutputAvgFrequency) {
      this.logRule(rules.acOutputAvgFrequency, sensor.avgFrequency);

      result.acOutputAvgFrequency = true;
    }

    if (sensor.protection?.acOutputVoltage && rules.acOutputVoltage) {
      this.logRule(rules.acOutputVoltage, sensor.voltage);

      result.acOutputVoltage = true;
    }

    if (sensor.protection?.acOutputAvgVoltage && rules.acOutputAvgVoltage) {
      this.logRule(rules.acOutputAvgVoltage, sensor.avgVoltage);

      result.acOutputAvgVoltage = true;
    }

    return result;
  }
}
