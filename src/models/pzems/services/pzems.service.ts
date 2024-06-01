import { Injectable } from '@nestjs/common';
import { PzemDto, PzemResponseDto } from '../dto';
import { PzemsRepository } from '../pzems.repository';
import { PzemsCalculationService } from './pzems-calculation.service';

@Injectable()
export class PzemsService {
  constructor(
    private readonly pzemsRepository: PzemsRepository,
    private readonly pzemsCalculationService: PzemsCalculationService,
  ) {}

  getAllPzems(): Promise<PzemResponseDto[]> {
    return this.pzemsRepository.getAllPzems();
  }

  createPzem(pzemDto: PzemDto): Promise<void> {
    const avgVoltage = this.pzemsCalculationService.calcAvgVoltage(pzemDto);

    return this.pzemsRepository.createPzem(pzemDto, avgVoltage);
  }
}
