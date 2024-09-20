import { Injectable } from '@nestjs/common';
import { CreatePzemDto } from '../dto';
import { PzemsRepository } from '../pzems.repository';
import { Pzem } from '../entities';
import { EspApiService, EspResetPzemCounterResponse } from '@api/modules';
import { PzemsCalculationService } from './pzems-calculation.service';

@Injectable()
export class PzemsService {
  constructor(
    private readonly pzemsRepository: PzemsRepository,
    private readonly pzemsCalculationService: PzemsCalculationService,
    private readonly espApiService: EspApiService,
  ) {}

  async create(createPzemDto: CreatePzemDto): Promise<Pzem> {
    await this.pzemsCalculationService.calcAvgVoltage(createPzemDto);

    return this.pzemsRepository.create(createPzemDto);

    // return new Pzem();
  }

  findAll(): Promise<Pzem[]> {
    return this.pzemsRepository.findAll();
  }

  checkHealth(): Promise<string> {
    return this.espApiService.checkHealth();
  }

  resetEnergyCounter(): Promise<EspResetPzemCounterResponse> {
    return this.espApiService.resetCounter();
  }
}
