import { Module } from '@nestjs/common';
import { PzemsModule } from './models/pzems/pzems.module';

@Module({
  imports: [PzemsModule],
})
export class AppModule {}
