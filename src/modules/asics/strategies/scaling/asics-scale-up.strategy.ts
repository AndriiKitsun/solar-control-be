import { AsicsScaleStrategy } from '../../types/asic-scaling.types';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ControlRule } from '../../../automation/control-rule/entities';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SENSORS_DATA_CACHE } from '../../../sensors/sensors.constants';
import { Sensor } from '../../../sensors/entities';
import { SensorId } from '../../../sensors/enums';
import { AsicsService } from '../../asics.service';
import { AsicsApiService, AsicPerfSummary } from '@api/modules';
import { Asic } from '../../entities';
import { decrypt } from '@common/utils';
import { delay } from '@common/utils/time.util';
import { ASIC_START_IDLE_TIME } from '../../asics.constants';
import { Maybe } from '@common/types';
import { ControlRuleId } from '../../../automation/control-rule/enums';

@Injectable()
export class AsicsScaleUpStrategy implements AsicsScaleStrategy {
  savedPerfSummary: Maybe<AsicPerfSummary>;
  savedAsic: Maybe<Asic>;

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

    await this.findFirstStoppedAsic(asics);

    if (this.savedAsic) {
      const token = await this.asicsApiService.login(
        this.savedAsic.ip,
        decrypt(this.savedAsic.password),
      );

      await this.asicsApiService.start(this.savedAsic.ip, token);

      await delay(ASIC_START_IDLE_TIME);

      this.savedPerfSummary = await this.asicsApiService.getPerfSummary(
        this.savedAsic.ip,
      );
    }
  }

  shouldScale(sensor: Sensor, rule: ControlRule): boolean {
    if (rule.id !== ControlRuleId.DC_BATTERY_AVG_VOLTAGE) {
      return false;
    }

    const dcBattery = sensor.sensors.find(
      (sensorItem) => sensorItem.name === SensorId.DC_BATTERY,
    );

    if (!dcBattery?.avgVoltage || !rule.scaleUpValue) {
      return false;
    }

    return dcBattery.avgVoltage > rule.scaleUpValue;
  }

  async findFirstStoppedAsic(asics: Asic[]): Promise<void> {
    const statuses = await Promise.allSettled(
      asics.map((asic) => this.asicsApiService.getStatus(asic.ip)),
    );

    for (let i = 0; i < statuses.length; i++) {
      const status = statuses[i];

      if (
        status.status === 'fulfilled' &&
        status.value.miner_state === 'stopped'
      ) {
        this.savedAsic = asics[i];

        break;
      }
    }
  }

  async findAsicWithSmallestPreset(asics: Asic[]): Promise<void> {
    const perfSummaries = await Promise.allSettled(
      asics.map((asic) => this.asicsApiService.getPerfSummary(asic.ip)),
    );

    for (let i = 0; i < perfSummaries.length; i++) {
      const perfSummary = perfSummaries[i];

      if (perfSummary.status === 'rejected') {
        continue;
      }

      const preset = perfSummary.value?.current_preset?.name;
      const savedPreset = this.savedPerfSummary?.current_preset?.name;

      if (!preset || (savedPreset && savedPreset < preset)) {
        continue;
      }

      this.savedPerfSummary = perfSummary.value;
      this.savedAsic = asics[i];
    }
  }
}
