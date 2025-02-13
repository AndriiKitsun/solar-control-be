import { Injectable, Inject, Logger } from '@nestjs/common';
import { EspConfigType, EspConfig } from '@config/esp.config';
import { WsClientService } from '../../../common';
import { EspSensorsData } from '../esp.types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ESP_SENSORS_EVENT } from '../esp.constants';

@Injectable()
export class EspWsService extends WsClientService {
  protected override logger = new Logger(EspWsService.name);

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
