import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PzemResponseDto {
  @Expose()
  voltageV: number;

  @Expose()
  currentA: number;

  @Expose()
  powerKw: number;

  @Expose()
  frequencyHz: number;

  @Expose()
  powerFactor: number;

  @Expose()
  t1EnergyKwh: number;

  @Expose()
  t2EnergyKwh: number;

  @Expose()
  avg10minutesVoltageV: number;
}
