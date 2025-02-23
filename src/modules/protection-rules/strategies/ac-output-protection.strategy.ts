import { Injectable } from '@nestjs/common';
import { ProtectionRuleId } from '../enums';
import { SensorItem, SensorId } from '../../sensors';
import { ProtectionStrategy } from './protection.strategy';
import { LogsService } from '../../logs';

@Injectable()
export class AcOutputProtectionStrategy extends ProtectionStrategy {
  readonly name: SensorId = SensorId.AC_OUTPUT;

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

  constructor(protected override readonly logsService: LogsService) {
    super(logsService);
  }
}
