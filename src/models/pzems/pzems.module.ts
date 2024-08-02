import { Module } from '@nestjs/common';
import {
  PzemsService,
  PzemsFileService,
  PzemsCalculationService,
} from './services';
import { PzemsController } from './pzems.controller';
import { PzemsRepository } from './pzems.repository';

@Module({
  controllers: [PzemsController],
  providers: [
    PzemsService,
    PzemsRepository,
    PzemsCalculationService,
    PzemsFileService,
  ],
})
export class PzemsModule {}
