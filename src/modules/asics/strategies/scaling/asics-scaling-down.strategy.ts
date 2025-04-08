import { Injectable, Inject } from '@nestjs/common';
import { ControlRule } from '../../../automation/control-rule/entities';
import { Sensor } from '../../../sensors/entities';
import { ControlRuleId } from '../../../automation/control-rule/enums';
import { SensorId } from '../../../sensors/enums';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AsicsService } from '../../asics.service';
import { Asic } from '../../entities';
import { AsicPerfSummary, AsicsApiService } from '@api/modules';
import { decrypt } from '@common/utils';
import { AsicsScalingStrategy } from './asics-scaling.strategy';

@Injectable()
export class AsicsScalingDownStrategy extends AsicsScalingStrategy {
  constructor(
    @Inject(CACHE_MANAGER)
    protected override readonly cache: Cache,
    protected override readonly asicsService: AsicsService,
    protected override readonly asicsApiService: AsicsApiService,
  ) {
    super(cache, asicsService, asicsApiService);
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
}
