import { Exclude, Expose } from 'class-transformer';
import { PzemResponseDto } from './pzem.dto';

@Exclude()
export class PzemRecordResponseDto {
  @Expose()
  input: PzemResponseDto;

  @Expose()
  output: PzemResponseDto;

  @Expose()
  accOutput: PzemResponseDto;

  @Expose()
  solarOutput: PzemResponseDto;

  @Expose()
  recordTimeGmt: string;
}
