import { Injectable, Inject, Logger } from '@nestjs/common';
import { EspConfigType, EspConfig } from '@config/esp.config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ESP_SENSORS_EVENT } from '../../constants';
import { EspSensorsData } from './sensors.types';
import { AbstractWsService } from '../../../../services';

@Injectable()
export class EspSensorsWsService extends AbstractWsService {
  protected override logger = new Logger(EspSensorsWsService.name);

  constructor(
    @Inject(EspConfig.KEY)
    espConfig: EspConfigType,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(espConfig.wsEndpoint);
  }

  handleMessage(data: EspSensorsData, raw: string): void {
    this.eventEmitter.emit(ESP_SENSORS_EVENT, data, raw);
  }
}
