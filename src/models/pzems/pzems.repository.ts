import { Injectable } from '@nestjs/common';
import { Pzem } from './entities';
import { randomUUID } from 'node:crypto';
import { PzemDto, PzemResponseDto } from './dto';

@Injectable()
export class PzemsRepository {
  private pzems: Pzem[] = [];

  async getAllPzems(): Promise<PzemResponseDto[]> {
    return this.pzems.map(this.mapPzemToResponse);
  }

  async createPzem(pzemDto: PzemDto, avgVoltage: number): Promise<void> {
    const mappedPzem = this.mapDtoToPzem(pzemDto, avgVoltage);

    this.pzems.push(mappedPzem);
  }

  private mapPzemToResponse(pzem: Pzem): PzemResponseDto {
    return {
      id: pzem.id,
      voltageV: pzem.voltage_v,
      currentA: pzem.current_a,
      powerKw: pzem.power_kw,
      energyKwh: pzem.energy_kwh,
      frequencyHz: pzem.freq_hz,
      powerFactor: pzem.pf,
      t1EnergyKwh: pzem.t1_energy_kwh,
      t2EnergyKwh: pzem.t2_energy_kwh,
      avgVoltageV: pzem.avg_voltage_v,
    };
  }

  private mapDtoToPzem(pzemDto: PzemDto, avgVoltage: number): Pzem {
    return {
      id: randomUUID(),
      voltage_v: pzemDto.voltageV,
      current_a: pzemDto.currentA,
      power_kw: pzemDto.powerKw,
      energy_kwh: pzemDto.energyKwh,
      freq_hz: pzemDto.frequencyHz,
      pf: pzemDto.powerFactor,
      t1_energy_kwh: pzemDto.t1EnergyKwh,
      t2_energy_kwh: pzemDto.t2EnergyKwh,
      avg_voltage_v: avgVoltage,
      create_date: pzemDto.createdAt,
    };
  }
}
