import { Injectable } from '@nestjs/common';
import { PzemsRepository } from '../pzems.repository';
import { Pzem, PzemItem } from '../entities';
import { EspApiService, EspPzemCounter, EspPzemData } from '@api/modules';

interface CalcPzem {
  count: number;
  sum: number;
  debug: {
    date: Date;
    voltage?: number;
  }[];
}

@Injectable()
export class PzemsService {
  constructor(
    private readonly pzemsRepository: PzemsRepository,
    private readonly espApiService: EspApiService,
  ) {}

  async create(pzemData: EspPzemData): Promise<Pzem> {
    await this.getRecentPzems(pzemData, 1);

    // return {} as Pzem;
    return this.pzemsRepository.create(pzemData);
  }

  checkHealth(): Promise<string> {
    return this.espApiService.checkHealth();
  }

  resetEnergyCounter(): Promise<EspPzemCounter[]> {
    return this.espApiService.resetCounter();
  }

  async getRecentPzems(
    pzemData: EspPzemData,
    minutes: number,
  ): Promise<Record<string, CalcPzem>> {
    const limit = minutes * 60;
    const period = limit * 2.5;

    const recentPzems = await this.pzemsRepository.findAllBefore(
      pzemData.createdAtGmt,
      period,
    );

    const result: Record<string, CalcPzem> = {};

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

    return result;
  }
}
