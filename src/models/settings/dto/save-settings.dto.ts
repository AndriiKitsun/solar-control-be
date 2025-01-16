import { IsNumber, IsOptional, Min } from 'class-validator';

export class SaveSettingsDto {
  @Min(0)
  @IsNumber()
  @IsOptional()
  t1EnergyCcyPrice?: number;

  @Min(0)
  @IsNumber()
  @IsOptional()
  t2EnergyCcyPrice?: number;
}
