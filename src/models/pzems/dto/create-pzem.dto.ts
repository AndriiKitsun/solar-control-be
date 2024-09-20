import { IsDateString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PzemDto } from './pzem.dto';

export class CreatePzemDto {
  @IsDateString()
  createdAtGmt!: string;

  @ValidateNested({ each: true })
  @Type(() => PzemDto)
  @IsOptional()
  pzems?: PzemDto[];
}
