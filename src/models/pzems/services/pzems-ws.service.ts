import { Injectable, Inject } from '@nestjs/common';
import { PzemsGateway } from '../pzems.gateway';
import { PzemsService } from './pzems.service';
import { CreatePzemDto } from '../dto';
import { ESP_WS_SERVICE } from '@api/modules/esp/esp.constants';
import { EspWsServiceInterface } from '@api/modules';

@Injectable()
export class PzemsWsService {
  constructor(
    @Inject(ESP_WS_SERVICE)
    espWsService: EspWsServiceInterface,
    private readonly pzemsGateway: PzemsGateway,
    private readonly pzemsService: PzemsService,
  ) {
    espWsService.events.on(
      'message',
      (data: CreatePzemDto, rawMessage: string) => {
        void this.handleMessage(data, rawMessage);
      },
    );
  }

  async handleMessage(data: CreatePzemDto, rawMessage: string): Promise<void> {
    if (!data.pzems.length) {
      this.pzemsGateway.emitData(rawMessage);

      return;
    }

    const pzem = await this.pzemsService.create(data);

    this.pzemsGateway.emitData(JSON.stringify(pzem));
  }
}
