import { EspSensorsData } from '@api/modules/esp/esp.types';
import { ClassMock } from '@common/types/test.types';
import { EspSensorsWsService } from '@api/modules/esp/ws/sensors/sensors.service';

export class EspWsServiceMock implements ClassMock<EspSensorsWsService> {
  static readonly espPzemDataMock: EspSensorsData = {
    createdAtGmt: '2025-01-19T16:26:30.550Z',
    sensors: [],
  };

  handleMessage(data: EspSensorsData, raw: string): void {}
}
