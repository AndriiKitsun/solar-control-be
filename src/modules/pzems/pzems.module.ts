import { Module } from '@nestjs/common';
import { PzemsService } from './pzems.service';
import { PzemsController } from './pzems.controller';
import { PzemsRepository } from './pzems.repository';
import { EspApiModule } from '@api/modules/esp';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pzem, PzemItem } from './entities';
import { PzemsGateway } from './pzems.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Pzem, PzemItem]), EspApiModule],
  controllers: [PzemsController],
  providers: [PzemsService, PzemsRepository, PzemsGateway],
})
export class PzemsModule {}
