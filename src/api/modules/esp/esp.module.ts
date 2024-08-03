import { Module } from '@nestjs/common';
import { EspApiService } from './esp.service';
import { HttpApiModule } from '../../common';

@Module({
  imports: [HttpApiModule],
  providers: [EspApiService],
  exports: [EspApiService],
})
export class EspApiModule {}
