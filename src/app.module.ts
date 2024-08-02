import { Module } from '@nestjs/common';
import { PzemsModule } from '@models/pzems';
import { AsicsModule } from '@models/asics';

@Module({
  imports: [PzemsModule, AsicsModule],
})
export class AppModule {}
