import { Injectable } from '@nestjs/common';
import { PzemDto, PzemResponseDto } from '../dto';
import { PzemsRepository } from '../pzems.repository';
import { PzemsCalculationService } from './pzems-calculation.service';
import { EspApiService } from '@api/modules/esp';

@Injectable()
export class PzemsService {
  constructor(
    private readonly pzemsRepository: PzemsRepository,
    private readonly pzemsCalculationService: PzemsCalculationService,
    private readonly espApiService: EspApiService,
  ) {}

  getAllPzems(): Promise<PzemResponseDto[]> {
    return this.pzemsRepository.getAllPzems();
  }

  checkHealth(): Promise<string> {
    return this.espApiService.checkHealth();
  }

  createPzem(pzemDto: PzemDto): Promise<void> {
    const avgVoltage = this.pzemsCalculationService.calcAvgVoltage(pzemDto);

    return this.pzemsRepository.createPzem(pzemDto, avgVoltage);
  }

  resetEnergyCounter(): Promise<void> {
    return this.espApiService.resetCounter();
  }
}
