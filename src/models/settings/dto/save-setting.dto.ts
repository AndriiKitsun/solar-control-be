import { IsNumber, IsOptional, Min } from 'class-validator';

export class SaveSettingDto {
  @Min(0)
  @IsNumber()
  @IsOptional()
  t1EnergyCcyPrice?: number;

  @Min(0)
  @IsNumber()
  @IsOptional()
  t2EnergyCcyPrice?: number;
}
