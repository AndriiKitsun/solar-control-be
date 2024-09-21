import { IsOptional, IsNumber, IsString } from 'class-validator';

export abstract class PzemDto {
  @IsString()
  id!: string;

  @IsOptional()
  @IsNumber()
  voltageV?: number;

  @IsOptional()
  @IsNumber()
  currentA?: number;

  @IsOptional()
  @IsNumber()
  powerKw?: number;

  @IsOptional()
  @IsNumber()
  energyKwh?: number;

  @IsOptional()
  @IsNumber()
  frequencyHz?: number;

  @IsOptional()
  @IsNumber()
  powerFactor?: number;

  @IsOptional()
  @IsNumber()
  t1EnergyKwh?: number;

  @IsOptional()
  @IsNumber()
  t2EnergyKwh?: number;

  avgVoltageV?: number;
}
