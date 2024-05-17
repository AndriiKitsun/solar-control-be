import { Exclude, Expose } from 'class-transformer';
import { PzemResponseDto } from './pzem.dto';

@Exclude()
export class PzemRecordResponseDto {
  @Expose()
  inputAc: PzemResponseDto;

  @Expose()
  outputAc: PzemResponseDto;

  @Expose()
  batteryOutputDc: PzemResponseDto;

  @Expose()
  solarOutputDc: PzemResponseDto;

  @Expose()
  recordDateGmt: string;
}
