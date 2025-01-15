import { IsNumber } from 'class-validator';

export class CreateSettingDto {
  @IsNumber()
  t1EnergyCcyPrice?: number;

  @IsNumber()
  t2EnergyCcyPrice?: number;
}
