import { SensorItem, SensorId } from '../../sensors';
import { Injectable } from '@nestjs/common';
import { ProtectionRuleId } from '../enums';
import { ProtectionStrategy } from './protection.strategy';
import { LogsService } from '../../logs';

@Injectable()
export class DcBatteryProtectionStrategy extends ProtectionStrategy {
  readonly name: SensorId = SensorId.DC_BATTERY;

  protected readonly allowedRules: ProtectionRuleId[] = [
    ProtectionRuleId.DC_BATTERY_VOLTAGE,
  ];

  protected readonly valueMapper: Record<
    string,
    (sensor: SensorItem) => number | undefined
  > = {
    [ProtectionRuleId.DC_BATTERY_VOLTAGE]: (sensor) => sensor.voltage,
  };

  constructor(protected override readonly logsService: LogsService) {
    super(logsService);
  }
}
