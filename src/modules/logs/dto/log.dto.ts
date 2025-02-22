import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { LogType } from '../enums';

export class LogDto {
  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsEnum(LogType)
  @IsNotEmpty()
  type!: LogType;
}
