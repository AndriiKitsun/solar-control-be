import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { PzemSensorRepository } from './pzem-sensor.repository';

@Module({
  controllers: [SensorsController],
  providers: [SensorsService, PzemSensorRepository],
})
export class SensorsModule {}
