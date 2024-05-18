import { PzemDto } from './pzem.dto';
import { IsDateString } from 'class-validator';

export class SinglePzemDto extends PzemDto {
  @IsDateString()
  creationTimeGmt: string;
}
