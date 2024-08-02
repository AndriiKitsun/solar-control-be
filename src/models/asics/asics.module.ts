import { Module } from '@nestjs/common';
import { AsicsService } from './asics.service';
import { AsicsController } from './asics.controller';
import { AsicsRepository } from './asics.repository';
import { AsicsApiModule } from '@api/modules';

@Module({
  imports: [AsicsApiModule],
  controllers: [AsicsController],
  providers: [AsicsService, AsicsRepository],
})
export class AsicsModule {}
