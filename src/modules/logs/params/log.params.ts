import { IsDateString, IsOptional, IsEnum } from 'class-validator';
import { LogType, LogOrder } from '../enums';

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

  @IsEnum(LogOrder)
  @IsOptional()
  order?: LogOrder;
}
