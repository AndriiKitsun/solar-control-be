import { IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreatePzemDto {
  @IsDateString()
  createdAtGmt: string;

  @IsNumber()
  @IsOptional()
  voltageV?: number;

  @IsNumber()
  @IsOptional()
  currentA?: number;

  @IsNumber()
  @IsOptional()
  powerKw?: number;

  @IsNumber()
  @IsOptional()
  energyKwh?: number;

  @IsNumber()
  @IsOptional()
  frequencyHz?: number;

  @IsNumber()
  @IsOptional()
  powerFactor?: number;

  @IsNumber()
  @IsOptional()
  t1EnergyKwh?: number;

  @IsNumber()
  @IsOptional()
  t2EnergyKwh?: number;
}
