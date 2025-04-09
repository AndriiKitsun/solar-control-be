import { SensorId } from '../../../sensors/enums';
import { SensorItem } from '../../../sensors/entities';
import { Injectable } from '@nestjs/common';
import { ProtectionStrategy } from './protection.strategy';
import { LogsService } from '../../../logs/logs.service';
import {
  ProtectionRulesResult,
  ProtectionMappedRule,
} from '../protection-rule.types';

@Injectable()
export class DcBatteryProtectionStrategy extends ProtectionStrategy {
  readonly name: SensorId = SensorId.DC_BATTERY;

  constructor(protected override readonly logsService: LogsService) {
    super(logsService);
  }

  run(sensor: SensorItem, rules: ProtectionMappedRule): ProtectionRulesResult {
    const result: ProtectionRulesResult = {
      dcBatteryAvgVoltage: false,
    };

    if (sensor.protection?.dcBatteryAvgVoltage && rules.dcBatteryAvgVoltage) {
      this.logRule(rules.dcBatteryAvgVoltage, sensor.avgVoltage);

      result.dcBatteryAvgVoltage = true;
    }

    return result;
  }
}
