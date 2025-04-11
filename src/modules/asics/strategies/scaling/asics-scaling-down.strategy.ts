import { Injectable, Inject } from '@nestjs/common';
import { ControlRule } from '../../../automation/control-rule/entities';
import { ControlRuleId } from '../../../automation/control-rule/enums';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Asic } from '../../entities';
import { decrypt } from '@common/utils';
import { AsicsScalingStrategy } from './asics-scaling.strategy';
import { AsicsRepository } from '../../asics.repository';
import { AsicsApiFacade, AsicPerfSummary } from '@api/modules/asics';
import { EspSensorsData, EspSensorId } from '@api/modules/esp';
import { LogsService } from '../../../logs/logs.service';
import { LogType } from '../../../logs/enums';

@Injectable()
export class AsicsScalingDownStrategy extends AsicsScalingStrategy {
  constructor(
    @Inject(CACHE_MANAGER)
    protected override readonly cache: Cache,
    protected override readonly asicsRepository: AsicsRepository,
    protected override readonly asicsApiFacade: AsicsApiFacade,
    protected override readonly logsService: LogsService,
  ) {
    super(cache, asicsRepository, asicsApiFacade, logsService);
  }

  shouldScale(sensor: EspSensorsData, rule: ControlRule): boolean {
    if (rule.id !== ControlRuleId.DC_BATTERY_AVG_VOLTAGE) {
      return false;
    }

    const dcBattery = sensor.sensors.find(
      (sensorItem) => sensorItem.name === EspSensorId.DC_BATTERY,
    );

    if (!dcBattery?.avgVoltage) {
      return false;
    }

    return dcBattery.avgVoltage < rule.scaleDownValue;
  }

  async scale(): Promise<void> {
    const { asic, perfSummary } = await this.findAsicWithPreset(
      this.asics,
      (savedPreset, preset) => savedPreset > preset,
    );

    if (asic && perfSummary) {
      return this.decrementAsicPreset(asic, perfSummary);
    }
  }

  async decrementAsicPreset(
    asic: Asic,
    perfSummary: AsicPerfSummary,
  ): Promise<void> {
    const { ip, password } = asic;
    const token = await this.asicsApiFacade.login(ip, decrypt(password));

    const presets = await this.asicsApiFacade.getPresets(ip, token);
    const tunedPresets = presets.filter((preset) => preset.status === 'tuned');
    const activePresetIdx = tunedPresets.findIndex(
      (preset) => preset.name === perfSummary.current_preset?.name,
    );

    if (activePresetIdx === -1) {
      return;
    }

    if (activePresetIdx === 0) {
      await this.asicsApiFacade.stop(ip, token);

      return;
    }

    const preset = tunedPresets[activePresetIdx - 1];

    await this.logsService.runWith(() => this.changePreset(ip, token, preset), {
      before: {
        type: LogType.CONTROL,
        message: `Scaling down '${asic.hostname}' asic preset from '${perfSummary.current_preset?.name}' to '${preset.name}'`,
      },
      after: {
        type: LogType.CONTROL,
        message: `Error occurred during scaling down '${asic.hostname}' Asic`,
      },
    });
  }
}
