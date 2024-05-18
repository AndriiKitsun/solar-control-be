import { Module } from '@nestjs/common';
import { PzemsService } from './pzems.service';
import { PzemsController } from './pzems.controller';
import { PzemsRepository } from './pzems.repository';
import { PzemsFileService } from './pzems-file.service';

@Module({
  controllers: [PzemsController],
  providers: [PzemsService, PzemsRepository, PzemsFileService],
})
export class PzemsModule {}
