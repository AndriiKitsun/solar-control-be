import { SensorItem, SensorId } from '../../sensors';
import { Injectable } from '@nestjs/common';
import { ProtectionRuleId } from '../enums';
import { ProtectionStrategy } from './protection.strategy';
import { LogsService } from '../../logs';
import { ProtectionRule } from '../entities';

@Injectable()
export class DcBatteryProtectionStrategy extends ProtectionStrategy {
  readonly name: SensorId = SensorId.DC_BATTERY;

  constructor(protected override readonly logsService: LogsService) {
    super(logsService);
  }

  async run(
    sensor: SensorItem,
    rules: Record<ProtectionRuleId, ProtectionRule>,
  ): Promise<void> {
    let result = false;

    if (sensor.protection?.dcBatteryVoltage && rules.dcBatteryVoltage) {
      await this.logRule(rules.dcBatteryVoltage, sensor.voltage);

      result = true;
    }

    console.log(`dc result -->`, result);

    if (!result) {
      return;
    }

    // siable asics
  }
}
