import { ProtectionRuleId, ProtectionActionId } from '../enums';
import { IsNotEmpty, IsEnum, IsNumber } from 'class-validator';

export class ProtectionRuleDto {
  @IsEnum(ProtectionRuleId)
  @IsNotEmpty()
  id!: ProtectionRuleId;

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
