import { AsicsScaleStrategy } from '../../types/asic-scaling.types';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ControlRule } from '../../../automation/control-rule/entities';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SENSORS_DATA_CACHE } from '../../../sensors/sensors.constants';
import { Sensor } from '../../../sensors/entities';
import { SensorId } from '../../../sensors/enums';
import { AsicsService } from '../../asics.service';
import { AsicsApiService } from '@api/modules';
import { Asic } from '../../entities';
import { decrypt } from '@common/utils';
import { delay } from '@common/utils/time.util';
import { ASIC_START_IDLE_TIME } from '../../asics.constants';
import { Maybe } from '@common/types';

@Injectable()
export class AsicsScaleUpStrategy implements AsicsScaleStrategy {
  private logger = new Logger(AsicsScaleUpStrategy.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    private readonly asicsService: AsicsService,
    private readonly asicsApiService: AsicsApiService,
  ) {}

  async run(rule: ControlRule): Promise<void> {
    console.log(`${new Date().toJSON()} AsicsScaleUpStrategy -->`, rule);

    const sensor = await this.cache.get<Sensor>(SENSORS_DATA_CACHE);

    if (!sensor?.sensors?.length || !this.shouldScale(sensor, rule)) {
      return;
    }

    const asics = await this.asicsService.findAll();
    const disabledAsic = await this.getFirstStoppedAsic(asics);

    if (disabledAsic) {
      const token = await this.asicsApiService.login(
        disabledAsic.ip,
        decrypt(disabledAsic.password),
      );

      await this.asicsApiService.start(disabledAsic.ip, token);

      await delay(ASIC_START_IDLE_TIME);
    }
  }

  shouldScale(sensor: Sensor, rule: ControlRule): boolean {
    const dcBattery = sensor.sensors.find(
      (sensorItem) => sensorItem.name === SensorId.DC_BATTERY,
    );

    if (!dcBattery?.avgVoltage || rule.scaleUpValue) {
      return false;
    }

    return dcBattery.avgVoltage > rule.scaleUpValue;
  }

  async getFirstStoppedAsic(asics: Asic[]): Promise<Maybe<Asic>> {
    const statuses = await Promise.allSettled(
      asics.map((asic) => this.asicsApiService.getStatus(asic.ip)),
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

  async getAsicWithSmallestPreset(asics: Asic[]): Promise<Maybe<Asic>> {
    let savedPreset = '';
    let savedAsic: Maybe<Asic>;

    const perfSummaries = await Promise.allSettled(
      asics.map((asic) => this.asicsApiService.getPerfSummary(asic.ip)),
    );

    for (let i = 0; i < perfSummaries.length; i++) {
      const perfSummary = perfSummaries[i];

      if (perfSummary.status === 'rejected') {
        continue;
      }

      const preset = perfSummary.value?.current_preset?.name;

      if (!preset || (savedPreset && savedPreset < preset)) {
        continue;
      }

      savedPreset = preset;
      savedAsic = asics[i];
    }

    return savedAsic;
  }

  // async switchPreset(asic: Asic, authToken?: string): Promise<void> {
  //   let token: string;
  //
  //   if (!authToken) {
  //     token = await this.asicsApiService.login(asic.ip, decrypt(asic.password));
  //   }
  //
  //   const presets = await this.asicsApiService.getPresets(asic.ip, token);
  //   const tuned = presets.filter((preset) => preset.status === 'tuned');
  // }
}
