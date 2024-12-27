import { Module } from '@nestjs/common';
import { AsicsApiService } from './asics.service';
import { HttpClientModule } from '../../common';

@Module({
  imports: [HttpClientModule],
  providers: [AsicsApiService],
  exports: [AsicsApiService],
})
export class AsicsApiModule {}
