import { Module } from '@nestjs/common';
import { PzemsService } from './pzems.service';
import { PzemsController } from './pzems.controller';
import { PzemsRepository } from './pzems.repository';
import { EspApiModule } from '@api/modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pzem } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Pzem]), EspApiModule],
  controllers: [PzemsController],
  providers: [PzemsService, PzemsRepository],
})
export class PzemsModule {}
