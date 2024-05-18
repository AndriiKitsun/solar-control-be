import { IsNumber } from 'class-validator';

export class PzemDto {
  @IsNumber()
  voltageV: number;

  @IsNumber()
  currentA: number;

  @IsNumber()
  powerKw: number;

  @IsNumber()
  energyKwh: number;

  @IsNumber()
  frequencyHz: number;

  @IsNumber()
  powerFactor: number;

  @IsNumber()
  t1EnergyKwh: number;

  @IsNumber()
  t2EnergyKwh: number;
}
