import { ControlRule } from '../../../automation/control-rule/entities';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Asic } from '../../entities';
import { AsicWithPerfSummary } from '../../types/asic-scaling.types';
import { Maybe } from '@common/types';
import { AsicsRepository } from '../../asics.repository';
import {
  AsicsApiFacade,
  AsicPerfSummary,
  AsicPreset,
  AsicSettingSaveResult,
  AsicSetting,
} from '@api/modules/asics';
import { EspSensorsData, ESP_SENSORS_CACHE } from '@api/modules/esp';
import { LogsService } from '../../../logs/logs.service';
import { LogType } from '../../../logs/enums';

export abstract class AsicsScalingStrategy {
  asics: Asic[] = [];

  protected constructor(
    @Inject(CACHE_MANAGER)
    protected readonly cache: Cache,
    protected readonly asicsRepository: AsicsRepository,
    protected readonly asicsApiFacade: AsicsApiFacade,
    protected readonly logsService: LogsService,
  ) {}

  async run(rule: ControlRule): Promise<void> {
    try {
      const sensor = await this.cache.get<EspSensorsData>(ESP_SENSORS_CACHE);

      if (!sensor?.sensors?.length || !this.shouldScale(sensor, rule)) {
        return;
      }

      this.asics = await this.asicsRepository.findWhere({ automated: true });

      await this.scale();
    } catch {
      this.logsService.error({
        type: LogType.CONTROL,
        message: 'An unknown error occurred during scaling Asics',
      });
    }
  }

  async findAsicWithPreset(
    asics: Asic[],
    presetPredicate: (savedPreset: string, preset: string) => boolean,
  ): Promise<AsicWithPerfSummary> {
    const perfSummaries = await Promise.allSettled(
      asics.map((asic) => this.asicsApiFacade.getPerfSummary(asic.ip)),
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

      if (!preset || (savedPreset && presetPredicate(savedPreset, preset))) {
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

  async changePreset(
    ip: string,
    token: string,
    preset: AsicPreset,
  ): Promise<AsicSettingSaveResult> {
    const settings = await this.asicsApiFacade.getSettings(ip, token);

    const changePresetSetting: AsicSetting = {
      miner: {
        overclock: {
          preset: preset.name,
          modded_psu: preset.modded_psu_required,
          preset_switcher: settings.miner.overclock?.preset_switcher,
          globals: {
            freq: preset.tune_settings?.freq,
            volt: preset.tune_settings?.volt
              ? Math.round(preset.tune_settings.volt / 10)
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

    return this.asicsApiFacade.saveSettings(ip, token, changePresetSetting);
  }

  abstract shouldScale(sensor: EspSensorsData, rule: ControlRule): boolean;
  abstract scale(): Promise<void>;
}
