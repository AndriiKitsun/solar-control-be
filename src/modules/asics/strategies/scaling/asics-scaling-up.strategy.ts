import { Injectable, Inject } from '@nestjs/common';
import { ControlRule } from '../../../automation/control-rule/entities';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Asic } from '../../entities';
import { decrypt, delay } from '@common/utils';
import { ASIC_START_IDLE_TIME } from '../../asics.constants';
import { Maybe } from '@common/types';
import { ControlRuleId } from '../../../automation/control-rule/enums';
import { AsicsScalingStrategy } from './asics-scaling.strategy';
import { AsicsRepository } from '../../asics.repository';
import { AsicsApiFacade, AsicPerfSummary } from '@api/modules/asics';
import { EspSensorsData, EspSensorId } from '@api/modules/esp';
import { LogsService } from '../../../logs/logs.service';
import { LogType } from '../../../logs/enums';

@Injectable()
export class AsicsScalingUpStrategy extends AsicsScalingStrategy {
  private isStarting = false;

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

    return dcBattery.avgVoltage > rule.scaleUpValue;
  }

  async scale(): Promise<void> {
    const stoppedAsic = await this.findFirstStoppedAsic(this.asics);

    if (stoppedAsic) {
      return this.startAsicOnFirstPreset(stoppedAsic);
    }

    if (this.isStarting) {
      return;
    }

    const { asic, perfSummary } = await this.findAsicWithPreset(
      this.asics,
      (savedPreset, preset) => savedPreset < preset,
    );

    if (asic && perfSummary) {
      return this.incrementAsicPreset(asic, perfSummary);
    }
  }

  async findFirstStoppedAsic(asics: Asic[]): Promise<Maybe<Asic>> {
    const statuses = await Promise.allSettled(
      asics.map((asic) => this.asicsApiFacade.getStatus(asic.ip)),
    );

    for (let i = 0; i < statuses.length; i++) {
      const status = statuses[i];

      if (
        status.status === 'fulfilled' &&
        status.value.miner_state === 'stopped'
      ) {
        return asics[i];
      }
    }
  }

  async startAsicOnFirstPreset(asic: Asic): Promise<void> {
    const { ip, password } = asic;
    const token = await this.asicsApiFacade.login(ip, decrypt(password));

    await this.logsService.runWith(() => this.asicsApiFacade.start(ip, token), {
      before: {
        type: LogType.CONTROL,
        message: `Starting '${asic.hostname}' Asic`,
      },
      after: {
        type: LogType.CONTROL,
        message: `Error occurred during starting '${asic.hostname}' Asic`,
      },
    });

    this.isStarting = true;

    await delay(ASIC_START_IDLE_TIME);

    this.isStarting = false;

    const presets = await this.asicsApiFacade.getPresets(ip, token);
    const perfSummary = await this.asicsApiFacade.getPerfSummary(ip);
    const firstPreset = presets.find((preset) => preset.status === 'tuned');

    if (!firstPreset || firstPreset.name === perfSummary.current_preset?.name) {
      return;
    }

    await this.logsService.runWith(
      () => this.changePreset(ip, token, firstPreset),
      {
        before: {
          type: LogType.CONTROL,
          message: `Switching '${asic.hostname}' asic preset from '${perfSummary.current_preset?.name}' to '${firstPreset.name}'`,
        },
        after: {
          type: LogType.CONTROL,
          message: `Error occurred during switching preset for '${asic.hostname}' Asic`,
        },
      },
    );
  }

  async incrementAsicPreset(
    asic: Asic,
    perfSummary: AsicPerfSummary,
  ): Promise<void> {
    const { ip, password } = asic;
    const token = await this.asicsApiFacade.login(ip, decrypt(password));

    const presets = await this.asicsApiFacade.getPresets(ip, token);
    const tuned = presets.filter((preset) => preset.status === 'tuned');
    const activePresetIdx = tuned.findIndex(
      (preset) => preset.name === perfSummary.current_preset?.name,
    );
    const preset = tuned[activePresetIdx + 1];

    if (activePresetIdx === -1 || !preset) {
      return;
    }

    await this.logsService.runWith(() => this.changePreset(ip, token, preset), {
      before: {
        type: LogType.CONTROL,
        message: `Scaling up '${asic.hostname}' asic preset from '${perfSummary.current_preset?.name}' to '${preset.name}'`,
      },
      after: {
        type: LogType.CONTROL,
        message: `Error occurred during scaling up '${asic.hostname}' Asic`,
      },
    });
  }
}
