import { SensorId } from '../../../sensors/enums';
import { SensorItem } from '../../../sensors/entities';
import { Injectable } from '@nestjs/common';
import { ProtectionRuleId } from '../enums';
import { ProtectionStrategy } from './protection.strategy';
import { LogsService } from '../../../logs/logs.service';
import { ProtectionRule } from '../entities';
import { ProtectionRuleResult } from '../protection-rule.types';

@Injectable()
export class DcBatteryProtectionStrategy extends ProtectionStrategy {
  readonly name: SensorId = SensorId.DC_BATTERY;

  constructor(protected override readonly logsService: LogsService) {
    super(logsService);
  }

  run(
    sensor: SensorItem,
    rules: Record<ProtectionRuleId, ProtectionRule>,
  ): ProtectionRuleResult {
    const result: ProtectionRuleResult = {
      dcBatteryAvgVoltage: false,
    };

    if (sensor.protection?.dcBatteryAvgVoltage && rules.dcBatteryAvgVoltage) {
      this.logRule(rules.dcBatteryAvgVoltage, sensor.voltage);

      result.dcBatteryAvgVoltage = true;
    }

    return result;
  }
}
