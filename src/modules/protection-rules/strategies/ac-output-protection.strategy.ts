import { Injectable } from '@nestjs/common';
import { ProtectionRuleId } from '../enums';
import { SensorItem } from '../../sensors';
import { ProtectionRule } from '../entities';
import { EspSensorId } from '@api/modules/esp';
import { ProtectionStrategy } from './protection.strategy';

@Injectable()
export class AcOutputProtectionStrategy extends ProtectionStrategy {
  readonly name: string = EspSensorId.AC_OUTPUT;

  protected readonly allowedRules: ProtectionRuleId[] = [
    ProtectionRuleId.AC_OUTPUT_FREQUENCY,
    ProtectionRuleId.AC_OUTPUT_VOLTAGE,
    ProtectionRuleId.AC_OUTPUT_AVG_VOLTAGE,
  ];

  protected readonly valueMapper: Record<
    string,
    (sensor: SensorItem) => number | undefined
  > = {
    [ProtectionRuleId.AC_OUTPUT_FREQUENCY]: (sensor) => sensor.frequency,
    [ProtectionRuleId.AC_OUTPUT_VOLTAGE]: (sensor) => sensor.voltage,
    [ProtectionRuleId.AC_OUTPUT_AVG_VOLTAGE]: (sensor) => sensor.avgVoltage,
  };

  override run(sensor: SensorItem, rules: ProtectionRule[]): boolean {
    const result = super.run(sensor, rules);

    console.log(`ac result -->`, result);

    return result;
  }
}
