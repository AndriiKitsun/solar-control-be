import { EspSensorId } from '@api/modules/esp';
import { SensorItem } from '../../sensors';
import { ProtectionRule } from '../entities';
import { Injectable } from '@nestjs/common';
import { ProtectionRuleId } from '../enums';
import { ProtectionStrategy } from './protection.strategy';

@Injectable()
export class DcBatteryProtectionStrategy extends ProtectionStrategy {
  readonly name = EspSensorId.DC_BATTERY;

  protected readonly allowedRules: ProtectionRuleId[] = [
    ProtectionRuleId.DC_BATTERY_VOLTAGE,
  ];

  protected readonly valueMapper: Record<
    string,
    (sensor: SensorItem) => number | undefined
  > = {
    [ProtectionRuleId.DC_BATTERY_VOLTAGE]: (sensor) => sensor.voltage,
  };

  override run(sensor: SensorItem, rules: ProtectionRule[]): boolean {
    const result = super.run(sensor, rules);

    console.log(`result -->`, result);

    return result;
  }
}
