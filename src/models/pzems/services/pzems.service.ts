import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { PzemsRepository } from '../pzems.repository';
import { Pzem, PzemItem } from '../entities';
import { EspApiService, EspPzemCounter, EspPzemData } from '@api/modules';
import { AppConfig, AppConfigType } from '@config/app';
import { PzemGroup } from '../pzems.types';

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

  async create(pzemData: EspPzemData): Promise<Pzem> {
    await this.calcAvgVoltage(pzemData, 1);

    return this.pzemsRepository.create(pzemData);
  }

  checkHealth(): Promise<string> {
    return this.espApiService.checkHealth();
  }

  resetEnergyCounter(): Promise<EspPzemCounter[]> {
    return this.espApiService.resetCounter();
  }

  async calcAvgVoltage(pzemData: EspPzemData, minutes: number): Promise<void> {
    const limit = minutes * 60;
    const period = limit * 2;

    const recentPzems = await this.pzemsRepository.findAllBefore(
      pzemData.createdAtGmt,
      period,
    );

    const result: Record<string, PzemGroup> = {};

    for (const recentPzem of recentPzems) {
      recentPzem.pzems.forEach((pzem) => {
        if (!result[pzem.name]) {
          result[pzem.name] = {
            count: 0,
            sum: 0,
            debug: [],
          };
        }

        const group = result[pzem.name];

        if (group.count >= limit) {
          return;
        }

        group.count++;
        group.sum += pzem.voltageV!;
        group.debug.push({
          date: recentPzem.createdAtGmt,
          voltage: pzem.voltageV,
        });
      });
    }

    console.log({
      now: new Date().toJSON(),
      rawLen: recentPzems.length,
      ...result,
      recentPzems,
    });

    for (const pzemDto of pzemData.pzems) {
      const group = result[pzemDto.name];

      if (!group || group.count < limit) {
        (pzemDto as PzemItem).avgVoltageV = 0;

        continue;
      }

      (pzemDto as PzemItem).avgVoltageV = group.sum / group.count;
    }
  }
}
