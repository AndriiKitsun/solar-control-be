import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { Observable } from 'rxjs';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Sse('sse')
  getSensorsData(): Observable<MessageEvent> {
    return this.sensorsService.getSensorsData();
  }
}
