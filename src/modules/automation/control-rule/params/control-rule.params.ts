import { IsEnum, IsNotEmpty } from 'class-validator';
import { ControlRuleId } from '../enums';

export class ControlRuleParams {
  @IsEnum(ControlRuleId)
  @IsNotEmpty()
  id!: ControlRuleId;
}
