import { IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class ProtectionRuleDto {
  @IsNumber()
  @IsNotEmpty()
  min!: number;

  @IsNumber()
  @IsNotEmpty()
  max!: number;

  @IsBoolean()
  @IsNotEmpty()
  enabled!: boolean;
}
