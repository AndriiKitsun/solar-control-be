import { Module } from '@nestjs/common';
import { SensorsModule } from './models/sensors/sensors.module';

@Module({
  imports: [SensorsModule],
})
export class AppModule {}
