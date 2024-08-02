import { Module } from '@nestjs/common';
import { AsicsApiService } from './asics.service';
import { HttpApiModule } from '../../common';

@Module({
  imports: [HttpApiModule],
  providers: [AsicsApiService],
  exports: [AsicsApiService],
})
export class AsicsApiModule {}
