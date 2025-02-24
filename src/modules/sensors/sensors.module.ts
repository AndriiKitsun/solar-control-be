import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { SensorsRepository } from './sensors.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor, SensorItem } from './entities';
import { SensorsController } from './sensors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, SensorItem])],
  controllers: [SensorsController],
  providers: [SensorsService, SensorsRepository],
})
export class SensorsModule {}
