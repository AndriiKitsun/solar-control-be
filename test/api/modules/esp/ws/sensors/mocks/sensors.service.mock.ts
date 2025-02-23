import { ClassMock } from '@common/types/test.types';
import { EspSensorsWsService } from '@api/modules/esp/ws/sensors/sensors.service';
import { EspSensorsData } from '@api/modules/esp';

export class EspSensorsWsServiceMock implements ClassMock<EspSensorsWsService> {
  static readonly espPzemDataMock: EspSensorsData = {
    createdAt: '2025-01-19T16:26:30.550Z',
    sensors: [],
  };

  handleMessage(data: EspSensorsData, raw: string): void {}
}
