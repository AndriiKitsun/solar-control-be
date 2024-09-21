import { Module } from '@nestjs/common';
import {
  PzemsService,
  PzemsWebSocketService,
  PzemsCalculationService,
} from './services';
import { PzemsController } from './pzems.controller';
import { PzemsRepository } from './pzems.repository';
import { EspApiModule } from '@api/modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pzem, PzemItem } from './entities';
import { PzemsGateway } from './pzems.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Pzem, PzemItem]), EspApiModule],
  controllers: [PzemsController],
  providers: [
    PzemsRepository,
    PzemsService,
    PzemsCalculationService,
    PzemsWebSocketService,
    PzemsGateway,
  ],
})
export class PzemsModule {}
