import { Module } from '@nestjs/common';
import { AsicsService } from './asics.service';
import { AsicsController } from './asics.controller';
import { AsicsRepository } from './asics.repository';
import { AsicsApiModule } from '@api/modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asic } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Asic]), AsicsApiModule],
  controllers: [AsicsController],
  providers: [AsicsService, AsicsRepository],
})
export class AsicsModule {}
