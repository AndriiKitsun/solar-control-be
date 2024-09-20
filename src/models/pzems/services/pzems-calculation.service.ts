import { Injectable } from '@nestjs/common';
import { CreatePzemDto, PzemDto } from '../dto';
import { PzemsRepository } from '../pzems.repository';
import { PZEM_MINUTES_TO_FETCH, PZEM_COUNT } from '../pzems.constants';

@Injectable()
export class PzemsCalculationService {
  constructor(private readonly pzemsRepository: PzemsRepository) {}

  async calcAvgVoltage(createPzemDto: CreatePzemDto): Promise<void> {
    const pzemsToCalc = this.getPzemsToCalc(createPzemDto.pzems);

    if (!pzemsToCalc.length) {
      return;
    }

    const recentPzems = await this.pzemsRepository.findRecentForCalc(
      createPzemDto.createdAtGmt,
      PZEM_MINUTES_TO_FETCH,
    );

    for (const pzemDto of pzemsToCalc) {
      const recentPzem = recentPzems[pzemDto.name];

      if (!pzemDto.voltageV || !recentPzem || recentPzem.count < PZEM_COUNT) {
        pzemDto.avgVoltageV = 0;
        continue;
      }

      pzemDto.avgVoltageV = recentPzem.sum / recentPzem.count;
    }
  }

  getPzemsToCalc(pzems: PzemDto[] | undefined): PzemDto[] {
    if (!pzems?.length) {
      return [];
    }

    return pzems.filter((pzem) => pzem.voltageV);
  }
}
