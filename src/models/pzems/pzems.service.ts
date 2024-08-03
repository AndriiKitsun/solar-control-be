import { Injectable } from '@nestjs/common';
import { CreatePzemDto } from './dto';
import { PzemsRepository } from './pzems.repository';
import { EspApiService } from '@api/modules/esp';
import { Pzem } from './entities';
import { TEN_MINUTES, TEN_MINUTES_PZEM_COUNT } from './pzems.constants';
import { PzemDtoToSave } from './pzems.types';

@Injectable()
export class PzemsService {
  constructor(
    private readonly pzemsRepository: PzemsRepository,
    private readonly espApiService: EspApiService,
  ) {}

  async create(createPzemDto: CreatePzemDto): Promise<PzemDtoToSave> {
    const avgVoltageV = await this.calcAvgVoltage(createPzemDto);

    return this.pzemsRepository.create({
      ...createPzemDto,
      avgVoltageV,
    });
  }

  findAll(): Promise<Pzem[]> {
    return this.pzemsRepository.findAll();
  }

  checkHealth(): Promise<string> {
    return this.espApiService.checkHealth();
  }

  resetEnergyCounter(): Promise<void> {
    return this.espApiService.resetCounter();
  }

  async calcAvgVoltage(pzem: CreatePzemDto): Promise<number> {
    if (!pzem.voltageV) {
      return 0;
    }

    const pzems = await this.pzemsRepository.findAllBeforeMinutes(
      pzem.createdAtGmt,
      TEN_MINUTES,
    );

    if (pzems.length < TEN_MINUTES_PZEM_COUNT) {
      return 0;
    }

    const sum = pzems.reduce((acc, pzem) => acc + pzem.voltageV, 0);

    return sum / pzems.length;
  }
}
