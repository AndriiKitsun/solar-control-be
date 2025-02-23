import { Injectable } from '@nestjs/common';
import { ProtectionRuleId } from '../enums';
import { SensorItem, SensorId } from '../../sensors';
import { ProtectionStrategy } from './protection.strategy';
import { LogsService } from '../../logs';
import { ProtectionRule } from '../entities';

@Injectable()
export class AcOutputProtectionStrategy extends ProtectionStrategy {
  readonly name: SensorId = SensorId.AC_OUTPUT;

  constructor(protected override readonly logsService: LogsService) {
    super(logsService);
  }

  async run(
    sensor: SensorItem,
    rules: Record<ProtectionRuleId, ProtectionRule>,
  ): Promise<void> {
    let result = false;

    if (sensor.protection?.acOutputFrequency && rules.acOutputFrequency) {
      await this.logRule(rules.acOutputFrequency, sensor.frequency);

      result = true;
    }

    if (sensor.protection?.acOutputVoltage && rules.acOutputVoltage) {
      await this.logRule(rules.acOutputVoltage, sensor.voltage);

      result = true;
    }

    if (this.checkRule(rules.acOutputAvgVoltage, sensor.avgVoltage)) {
      await this.logRule(rules.acOutputAvgVoltage, sensor.avgVoltage);

      result = true;
    }

    console.log(`ac result -->`, result);

    if (!result) {
      return;
    }

    // disable Asics
  }
}
