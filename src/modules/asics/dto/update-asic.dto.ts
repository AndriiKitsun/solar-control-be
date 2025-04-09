import { PartialType } from '@nestjs/mapped-types';
import { CreateAsicDto } from './create-asic.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAsicDto extends PartialType(CreateAsicDto) {
  @IsBoolean()
  @IsOptional()
  t2Active?: boolean;

  @IsBoolean()
  @IsOptional()
  t2EndStop?: boolean;

  @IsBoolean()
  @IsOptional()
  automated?: boolean;
}
