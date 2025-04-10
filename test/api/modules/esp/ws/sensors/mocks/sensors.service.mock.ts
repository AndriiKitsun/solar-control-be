import { ClassMock } from '@common/types/test.types';
import { EspSensorsWsService } from '@api/modules/esp/ws/sensors/sensors.service';
import { EspSensorsData } from '@api/modules/esp';

export class EspSensorsWsServiceMock implements ClassMock<EspSensorsWsService> {
  static readonly sensorMock: EspSensorsData = {
    createdAt: '2025-01-19T16:26:30.550Z',
    power: true,
    sensors: [
      {
        avgVoltage: 123,
      },
    ],
    pTriggered: false,
  };

  static readonly emptySensorMock: EspSensorsData = {
    createdAt: '2025-01-19T16:26:30.550Z',
    power: true,
    sensors: [],
    pTriggered: false,
  };

  static readonly sensorsMock: EspSensorsData[] = [this.sensorMock];

  handleMessage(data: EspSensorsData): void {}
}
