import { Module } from '@nestjs/common';
import { PzemsService } from './pzems.service';
import { PzemsController } from './pzems.controller';
import { EspApiModule } from '@api/modules/esp';

@Module({
  imports: [EspApiModule],
  controllers: [PzemsController],
  providers: [PzemsService],
})
export class PzemsModule {}
