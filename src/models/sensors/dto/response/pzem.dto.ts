import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PzemResponseDto {
  @Expose()
  voltageV: number;

  @Expose()
  currentA: number;

  @Expose()
  activePowerKw: number;

  @Expose()
  energyT1Kwh: number;

  @Expose()
  energyT2Kwh: number;

  @Expose()
  tenMinutesAverageVoltageV: number;
}
