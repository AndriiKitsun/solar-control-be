import { Injectable, MessageEvent } from '@nestjs/common';
import { EspSensorsData, ESP_SENSORS_EVENT } from '@api/modules/esp';
import { OnEvent } from '@nestjs/event-emitter';
import { Observable, Subject, map } from 'rxjs';

@Injectable()
export class SensorsService {
  private readonly sensorsSse$ = new Subject<EspSensorsData>();

  @OnEvent(ESP_SENSORS_EVENT)
  onSensorsEvent(data: EspSensorsData): void {
    this.sensorsSse$.next(data);
  }

  getSensorsData(): Observable<MessageEvent> {
    return this.sensorsSse$.pipe(map((data) => ({ data })));
  }
}
