import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProtectionRuleId } from '../enums';

export class ProtectionRuleParams {
  @IsEnum(ProtectionRuleId)
  @IsNotEmpty()
  id!: ProtectionRuleId;
}
