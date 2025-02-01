import { Injectable, Inject } from '@nestjs/common';
import { PzemsGateway } from '../pzems.gateway';
import { PzemsService } from './pzems.service';
import { ESP_WS_SERVICE } from '@api/modules/esp/esp.constants';
import { EspWsServiceInterface, EspSensorsData } from '@api/modules';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Pzem } from '../entities';

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
      (data: EspSensorsData, rawMessage: string) => {
        void this.handleMessage(data, rawMessage);
      },
    );
  }

  async handleMessage(data: EspSensorsData, rawMessage: string): Promise<void> {
    if (!data.sensors.length) {
      this.pzemsGateway.emitData(rawMessage);

      return;
    }

    const pzem = await this.pzemsService.create(data);

    this.pzemsGateway.emitData(
      JSON.stringify(instanceToPlain(plainToInstance(Pzem, pzem))),
    );
  }
}
