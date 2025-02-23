import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { LogType, LogLevel } from '../enums';

export class LogDto {
  @IsEnum(LogType)
  @IsNotEmpty()
  type!: LogType;

  @IsEnum(LogLevel)
  @IsNotEmpty()
  level!: LogLevel;

  @IsString()
  @IsNotEmpty()
  message!: string;
}
