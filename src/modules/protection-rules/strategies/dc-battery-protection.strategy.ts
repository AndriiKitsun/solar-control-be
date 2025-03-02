import { SensorId } from '../../sensors/enums';
import { SensorItem } from '../../sensors/entities';
import { Injectable } from '@nestjs/common';
import { ProtectionRuleId } from '../enums';
import { ProtectionStrategy } from './protection.strategy';
import { LogsService } from '../../logs/logs.service';
import { ProtectionRule } from '../entities';
import { ProtectionRuleResult } from '../protection-rules.types';

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
      dcBatteryVoltage: false,
    };

    if (sensor.protection?.dcBatteryVoltage && rules.dcBatteryVoltage) {
      this.logRule(rules.dcBatteryVoltage, sensor.voltage);

      result.dcBatteryVoltage = true;
    }

    return result;
  }
}
