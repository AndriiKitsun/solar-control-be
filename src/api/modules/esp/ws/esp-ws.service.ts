import { Injectable, Inject, Logger } from '@nestjs/common';
import { EspConfigType, EspConfig } from '@config/esp';
import { WsClientService } from '../../../common/services/ws-client.service';
import { EventEmitter } from 'node:events';
import { EspWsServiceInterface, EspPzemData } from '../esp.types';

@Injectable()
export class EspWsService
  extends WsClientService
  implements EspWsServiceInterface
{
  events = new EventEmitter();

  protected override logger = new Logger(EspWsService.name);

  constructor(
    @Inject(EspConfig.KEY)
    espConfig: EspConfigType,
  ) {
    super(espConfig.wsEndpoint);
  }

  handleMessage(data: EspPzemData, rawMessage: string): void {
    this.events.emit('message', data, rawMessage);
  }
}
