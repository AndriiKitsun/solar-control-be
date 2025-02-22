import { ProtectionActionId } from '../enums';
import { IsNotEmpty, IsEnum, IsNumber } from 'class-validator';

export class ProtectionRuleDto {
  @IsNumber()
  @IsNotEmpty()
  min!: number;

  @IsNumber()
  @IsNotEmpty()
  max!: number;

  @IsEnum(ProtectionActionId, { each: true })
  @IsNotEmpty({ each: true })
  actions!: ProtectionActionId[];
}
