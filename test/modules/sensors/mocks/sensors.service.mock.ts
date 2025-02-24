import { ClassMock } from '@common/types/test.types';
import {
  SensorsService,
  Sensor,
  SensorsAvgVoltageConfig,
} from '@modules/sensors';
import { Observable, of } from 'rxjs';
import { MessageEvent } from '@nestjs/common';
import { EspSensorsData } from '@api/modules/esp';
import { SensorsRepositoryMock } from './sensors.repository.mock';

export class SensorsServiceMock implements ClassMock<SensorsService> {
  async onSensorsEvent(sensorsMessage: EspSensorsData): Promise<void> {
    return;
  }

  onModuleInit(): void {}

  getSensorsData(): Observable<MessageEvent> {
    return of({ data: SensorsRepositoryMock.sensorMock });
  }

  async saveSensors(sensorsMessage: EspSensorsData): Promise<Sensor> {
    return SensorsRepositoryMock.sensorMock;
  }

  async calcAvgVoltage(
    sensorsData: Sensor,
    config: SensorsAvgVoltageConfig,
  ): Promise<void> {
    return;
  }
}
