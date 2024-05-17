import { IsNumber } from 'class-validator';

export class PzemDto {
  @IsNumber()
  voltageV: number;

  @IsNumber()
  currentA: number;

  @IsNumber()
  activePowerW: number;

  @IsNumber()
  activeEnergyKwh: number;

  @IsNumber()
  frequencyHz: number;

  @IsNumber()
  powerFactor: number;
}
