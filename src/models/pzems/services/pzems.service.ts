import { Injectable } from '@nestjs/common';
import { CreatePzemDto } from '../dto';
import { PzemsRepository } from '../pzems.repository';
import { Pzem } from '../entities';
import { EspApiService, EspResetPzemCounterResponse } from '@api/modules';
import { PZEM_MINUTES_TO_FETCH, PZEM_COUNT } from '../pzems.constants';

@Injectable()
export class PzemsService {
  constructor(
    private readonly pzemsRepository: PzemsRepository,
    private readonly espApiService: EspApiService,
  ) {}

  async create(createPzemDto: CreatePzemDto): Promise<Pzem> {
    await this.calcAvgVoltage(createPzemDto);

    return this.pzemsRepository.create(createPzemDto);
  }

  checkHealth(): Promise<string> {
    return this.espApiService.checkHealth();
  }

  resetEnergyCounter(): Promise<EspResetPzemCounterResponse> {
    return this.espApiService.resetCounter();
  }

  async calcAvgVoltage(createPzemDto: CreatePzemDto): Promise<void> {
    const recentPzems = await this.pzemsRepository.findRecentForCalc(
      createPzemDto.createdAtGmt,
      PZEM_MINUTES_TO_FETCH,
    );

    for (const pzemDto of createPzemDto.pzems) {
      const recentPzem = recentPzems[pzemDto.id];

      if (!recentPzem || recentPzem.count < PZEM_COUNT) {
        pzemDto.avgVoltageV = 0;
        continue;
      }

      pzemDto.avgVoltageV = recentPzem.sum / recentPzem.count;
    }
  }
}
