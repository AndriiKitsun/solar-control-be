import { ClassMock } from '@common/types/test.types';
import { SensorsService } from '@modules/sensors/sensors.service';
import { Observable, of } from 'rxjs';
import { MessageEvent } from '@nestjs/common';
import { EspSensorsData } from '@api/modules/esp';
import { EspSensorsWsServiceMock } from '@api/modules/esp/ws/sensors/mocks/sensors.service.mock';

export class SensorsServiceMock implements ClassMock<SensorsService> {
  onSensorsEvent(data: EspSensorsData): void {
    return;
  }

  getSensorsData(): Observable<MessageEvent> {
    return of({ data: EspSensorsWsServiceMock.sensorMock });
  }
}
