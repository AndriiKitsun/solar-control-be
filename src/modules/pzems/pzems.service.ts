import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { PzemsRepository } from './pzems.repository';
import { Pzem } from './entities';
import {
  EspPzemCounter,
  EspSensorsData,
  EspPzemsService,
} from '@api/modules/esp';
import { AppConfig, AppConfigType } from '@config/app.config';
import { SensorsAvgVoltageGroup, SensorsAvgVoltageConfig } from './pzems.types';
import { SENSORS_AVG_VOLTAGE_CONFIG } from './pzems.constants';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PzemsService implements OnModuleInit {
  private readonly logger = new Logger(PzemsService.name);

  constructor(
    private readonly pzemsRepository: PzemsRepository,
    private readonly espPzemsService: EspPzemsService,
    @Inject(AppConfig.KEY)
    private readonly appConfig: AppConfigType,
  ) {}

  onModuleInit(): void {
    if (this.appConfig.feature.clearPzems) {
      void this.pzemsRepository.clearPzemTable();
    }
  }

  async handleEspMessage(
    espSensors: EspSensorsData,
    raw: string,
  ): Promise<string> {
    const sensorsData = plainToInstance(Pzem, espSensors, {
      excludeExtraneousValues: true,
    });

    if (!sensorsData.sensors.length) {
      return raw;
    }

    try {
      if (isNaN(new Date(sensorsData.createdAt).getTime())) {
        throw new Error(`Timestamp '${espSensors.createdAt}' is invalid`);
      }

      const pzem = await this.saveSensors(sensorsData);
      const response = plainToInstance(Pzem, pzem);

      return JSON.stringify(response);
    } catch (err) {
      const fallback: Partial<Pzem> = {
        createdAt: new Date().toJSON(),
        sensors: [],
      };

      this.logger.error(err);

      return JSON.stringify(fallback);
    }
  }

  async saveSensors(sensorsData: Pzem): Promise<Pzem> {
    await this.calcAvgVoltage(sensorsData, SENSORS_AVG_VOLTAGE_CONFIG);

    return this.pzemsRepository.save(sensorsData);
  }

  resetEnergyCounter(): Promise<EspPzemCounter[]> {
    return this.espPzemsService.resetCounter();
  }

  async calcAvgVoltage(
    sensorsData: Pzem,
    config: SensorsAvgVoltageConfig,
  ): Promise<void> {
    const period = config.fetchLimit * this.appConfig.feature.pzemCalcPeriod;

    const recentSensors = await this.pzemsRepository.findAllBefore(
      sensorsData.createdAt,
      period,
    );

    const result: Record<string, SensorsAvgVoltageGroup> = {};

    for (const recent of recentSensors) {
      recent.sensors.forEach((pzem) => {
        if (!pzem.name) {
          return;
        }

        if (!result[pzem.name]) {
          result[pzem.name] = { count: 0, sum: 0 };
        }

        const group = result[pzem.name];

        if (group.count >= config.countLimit[pzem.name]) {
          return;
        }

        group.count++;
        group.sum += pzem.voltage!;
      });
    }

    for (const espSensor of sensorsData.sensors) {
      if (!espSensor.name) {
        espSensor.avgVoltage = 0;

        continue;
      }

      const group = result[espSensor.name];

      if (!group || group.count < config.countLimit[espSensor.name]) {
        espSensor.avgVoltage = 0;

        continue;
      }

      espSensor.avgVoltage = group.sum / group.count;
    }
  }
}
