import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { PzemsRepository } from '../pzems.repository';
import { Pzem, PzemItem } from '../entities';
import { EspApiService, EspPzemCounter, EspSensorsData } from '@api/modules';
import { AppConfig, AppConfigType } from '@config/app';
import {
  SensorsAvgVoltageGroup,
  SensorsAvgVoltageConfig,
} from '../pzems.types';
import { SENSORS_AVG_VOLTAGE_CONFIG } from '../pzems.constants';

@Injectable()
export class PzemsService implements OnModuleInit {
  constructor(
    private readonly pzemsRepository: PzemsRepository,
    private readonly espApiService: EspApiService,
    @Inject(AppConfig.KEY)
    private readonly appConfig: AppConfigType,
  ) {}

  async onModuleInit(): Promise<void> {
    if (this.appConfig.feature.clearPzems) {
      await this.pzemsRepository.clearPzemTable();
    }
  }

  async create(pzemData: EspSensorsData): Promise<Pzem> {
    await this.calcAvgVoltage(pzemData, SENSORS_AVG_VOLTAGE_CONFIG);

    return this.pzemsRepository.create(pzemData);
  }

  resetEnergyCounter(): Promise<EspPzemCounter[]> {
    return this.espApiService.resetCounter();
  }

  async calcAvgVoltage(
    pzemData: EspSensorsData,
    config: SensorsAvgVoltageConfig,
  ): Promise<void> {
    const period = config.fetchLimit * this.appConfig.feature.pzemCalcPeriod;

    const recentPzems = await this.pzemsRepository.findAllBefore(
      pzemData.createdAtGmt,
      period,
    );

    const result: Record<string, SensorsAvgVoltageGroup> = {};

    for (const recentPzem of recentPzems) {
      recentPzem.sensors.forEach((pzem) => {
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

    for (const pzemDto of pzemData.sensors) {
      const group = result[pzemDto.name];

      if (!group || group.count < config.countLimit[pzemDto.name]) {
        (pzemDto as PzemItem).avgVoltage = 0;

        continue;
      }

      (pzemDto as PzemItem).avgVoltage = group.sum / group.count;
    }
  }
}
