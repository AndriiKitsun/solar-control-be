import { PzemDto } from './pzem.dto';
import { ValidateNested, IsDateString } from 'class-validator';

export class CreatePzemSensorDto {
  @ValidateNested()
  inputAc: PzemDto;

  @ValidateNested()
  outputAc: PzemDto;

  @ValidateNested()
  batteryOutputDc: PzemDto;

  @ValidateNested()
  solarOutputDc: PzemDto;

  @IsDateString()
  recordDateGmt: string;
}
