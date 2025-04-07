import { Injectable, Inject } from '@nestjs/common';
import { ControlRule } from '../../../automation/control-rule/entities';
import { Sensor } from '../../../sensors/entities';
import { SENSORS_DATA_CACHE } from '../../../sensors/sensors.constants';
import { ControlRuleId } from '../../../automation/control-rule/enums';
import { SensorId } from '../../../sensors/enums';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AsicsService } from '../../asics.service';
import { Asic } from '../../entities';
import { AsicWithPerfSummary } from '../../types/asic-scaling.types';
import { Maybe } from '@common/types';
import {
  AsicPerfSummary,
  AsicsApiService,
  AsicPreset,
  AsicSettingSaveResult,
  AsicSetting,
} from '@api/modules';
import { decrypt } from '@common/utils';

@Injectable()
export class AsicsScaleDownStrategy {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    private readonly asicsService: AsicsService,
    private readonly asicsApiService: AsicsApiService,
  ) {}

  async run(rule: ControlRule): Promise<void> {
    const sensor = await this.cache.get<Sensor>(SENSORS_DATA_CACHE);

    if (!sensor?.sensors?.length || !this.shouldScale(sensor, rule)) {
      return;
    }

    const asics = await this.asicsService.findAll();
    const { asic, perfSummary } = await this.findAsicWithHighestPreset(asics);

    if (!asic || !perfSummary) {
      return;
    }

    return this.decrementAsicPreset(asic, perfSummary);
  }

  shouldScale(sensor: Sensor, rule: ControlRule): boolean {
    if (rule.id !== ControlRuleId.DC_BATTERY_AVG_VOLTAGE) {
      return false;
    }

    const dcBattery = sensor.sensors.find(
      (sensorItem) => sensorItem.name === SensorId.DC_BATTERY,
    );

    if (!dcBattery?.avgVoltage) {
      return false;
    }

    return dcBattery.avgVoltage < rule.scaleDownValue;
  }

  async findAsicWithHighestPreset(asics: Asic[]): Promise<AsicWithPerfSummary> {
    const perfSummaries = await Promise.allSettled(
      asics.map((asic) => this.asicsApiService.getPerfSummary(asic.ip)),
    );

    let savedAsic: Maybe<Asic>;
    let savedPerfSummary: Maybe<AsicPerfSummary>;

    for (let i = 0; i < perfSummaries.length; i++) {
      const perfSummary = perfSummaries[i];

      if (perfSummary.status === 'rejected') {
        continue;
      }

      const preset = perfSummary.value?.current_preset?.name;
      const savedPreset = savedPerfSummary?.current_preset?.name;

      if (!preset || (savedPreset && savedPreset > preset)) {
        continue;
      }

      savedAsic = asics[i];
      savedPerfSummary = perfSummary.value;
    }

    return {
      asic: savedAsic,
      perfSummary: savedPerfSummary,
    };
  }

  async decrementAsicPreset(
    asic: Asic,
    perfSummary: AsicPerfSummary,
  ): Promise<void> {
    const { ip, password } = asic;
    const token = await this.asicsApiService.login(ip, decrypt(password));

    const presets = await this.asicsApiService.getPresets(ip, token);
    const tunedPresets = presets.filter((preset) => preset.status === 'tuned');
    const activePresetIdx = tunedPresets.findIndex(
      (preset) => preset.name === perfSummary.current_preset?.name,
    );

    if (activePresetIdx === -1) {
      return;
    }

    if (activePresetIdx === 0) {
      await this.asicsApiService.stop(ip, token);

      return;
    }

    await this.changePreset(ip, token, tunedPresets[activePresetIdx - 1]);
  }

  async changePreset(
    ip: string,
    token: string,
    preset: AsicPreset,
  ): Promise<AsicSettingSaveResult> {
    const settings = await this.asicsApiService.getSettings(ip, token);

    const changePresetSetting: AsicSetting = {
      miner: {
        overclock: {
          preset: preset.name,
          modded_psu: preset.modded_psu_required,
          preset_switcher: settings.miner.overclock?.preset_switcher,
          globals: {
            freq: preset.tune_settings?.freq,
            volt: preset.tune_settings?.volt
              ? preset.tune_settings.volt / 10
              : undefined,
          },
          chains: preset.tune_settings?.chains?.map((chain, i) => ({
            freq: chain.freq,
            disabled: settings.miner.overclock?.chains?.[i]?.disabled,
            chips: chain.chips,
          })),
        },
      },
    };

    return this.asicsApiService.saveSettings(ip, token, changePresetSetting);
  }
}
