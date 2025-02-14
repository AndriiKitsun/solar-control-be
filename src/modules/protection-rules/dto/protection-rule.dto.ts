import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ProtectionRuleId, ProtectionActionId } from '../enums';

export class ProtectionRuleDto {
  @IsEnum(ProtectionRuleId)
  @IsNotEmpty()
  groupId!: ProtectionRuleId;

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
