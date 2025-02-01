import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { PzemsRepository } from '../pzems.repository';
import { Pzem, PzemItem } from '../entities';
import { EspApiService, EspPzemCounter, EspSensorsData } from '@api/modules';
import { AppConfig, AppConfigType } from '@config/app';
import { PzemGroup } from '../pzems.types';
import { PZEM_MINUTES_TO_FETCH } from '../pzems.constants';

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
    await this.calcAvgVoltage(pzemData, PZEM_MINUTES_TO_FETCH);

    return this.pzemsRepository.create(pzemData);
  }

  resetEnergyCounter(): Promise<EspPzemCounter[]> {
    return this.espApiService.resetCounter();
  }

  async calcAvgVoltage(
    pzemData: EspSensorsData,
    minutes: number,
  ): Promise<void> {
    const limit = minutes * 60;
    const period = limit * this.appConfig.feature.pzemCalcPeriod;

    const recentPzems = await this.pzemsRepository.findAllBefore(
      pzemData.createdAtGmt,
      period,
    );

    const result: Record<string, PzemGroup> = {};

    for (const recentPzem of recentPzems) {
      recentPzem.pzems.forEach((pzem) => {
        if (!result[pzem.name]) {
          result[pzem.name] = { count: 0, sum: 0 };
        }

        const group = result[pzem.name];

        if (group.count >= limit) {
          return;
        }

        group.count++;
        group.sum += pzem.voltage!;
      });
    }

    for (const pzemDto of pzemData.sensors) {
      const group = result[pzemDto.name];

      if (!group || group.count < limit) {
        (pzemDto as PzemItem).avgVoltage = 0;

        continue;
      }

      (pzemDto as PzemItem).avgVoltage = group.sum / group.count;
    }
  }
}
