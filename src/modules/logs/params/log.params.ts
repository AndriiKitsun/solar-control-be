import { IsDateString, IsOptional, IsEnum } from 'class-validator';
import { LogType } from '../enums';

export class LogParams {
  @IsDateString()
  @IsOptional()
  from?: string;

  @IsDateString()
  @IsOptional()
  to?: string;

  @IsEnum(LogType)
  @IsOptional()
  type?: LogType;
}
