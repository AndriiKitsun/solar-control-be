import { PartialType } from '@nestjs/mapped-types';
import { CreateAsicDto } from './create-asic.dto';

export class UpdateAsicDto extends PartialType(CreateAsicDto) {}
