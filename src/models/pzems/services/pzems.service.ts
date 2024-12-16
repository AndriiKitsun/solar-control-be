import { Injectable } from '@nestjs/common';
import { PzemsRepository } from '../pzems.repository';
import { Pzem, PzemItem } from '../entities';
import {
  EspApiService,
  EspResetPzemCounterResponse,
  EspPzemData,
} from '@api/modules';
import { PZEM_MINUTES_TO_FETCH, PZEM_COUNT } from '../pzems.constants';

@Injectable()
export class PzemsService {
  constructor(
    private readonly pzemsRepository: PzemsRepository,
    private readonly espApiService: EspApiService,
  ) {}

  async create(pzemData: EspPzemData): Promise<Pzem> {
    await this.calcAvgVoltage(pzemData);

    return this.pzemsRepository.create(pzemData);
  }

  checkHealth(): Promise<string> {
    return this.espApiService.checkHealth();
  }

  resetEnergyCounter(): Promise<EspResetPzemCounterResponse> {
    return this.espApiService.resetCounter();
  }

  async calcAvgVoltage(pzemData: EspPzemData): Promise<void> {
    const recentPzems = await this.pzemsRepository.findRecentForCalc(
      pzemData.createdAtGmt,
      PZEM_MINUTES_TO_FETCH,
    );

    for (const pzemDto of pzemData.pzems) {
      const recentPzem = recentPzems[pzemDto.name];

      if (!recentPzem || recentPzem.count < PZEM_COUNT) {
        (pzemDto as PzemItem).avgVoltageV = 0;

        continue;
      }

      (pzemDto as PzemItem).avgVoltageV = recentPzem.sum / recentPzem.count;
    }
  }
}
