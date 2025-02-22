import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { SensorsRepository } from './sensors.repository';
import { EspApiModule } from '@api/modules/esp';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor, SensorItem } from './entities';
import { SensorsGateway } from './sensors.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, SensorItem]), EspApiModule],
  providers: [SensorsService, SensorsRepository, SensorsGateway],
})
export class SensorsModule {}
