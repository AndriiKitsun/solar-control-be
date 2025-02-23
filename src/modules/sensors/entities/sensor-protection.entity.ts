import { Expose } from 'class-transformer';

export class SensorProtection {
  @Expose()
  acOutputFrequency?: boolean;

  @Expose()
  acOutputVoltage?: boolean;

  @Expose()
  dcBatteryVoltage?: boolean;
}
