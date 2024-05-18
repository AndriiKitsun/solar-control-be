import { PzemDto } from './pzem.dto';
import {
  ValidateNested,
  IsDateString,
  IsNotEmptyObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePzemRecordDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PzemDto)
  input: PzemDto;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PzemDto)
  output: PzemDto;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PzemDto)
  accOutput: PzemDto;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => PzemDto)
  solarOutput: PzemDto;

  @IsDateString()
  recordTimeGmt: string;
}
