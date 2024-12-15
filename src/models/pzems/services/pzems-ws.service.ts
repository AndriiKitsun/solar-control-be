import { Injectable, Inject } from '@nestjs/common';
import { EspConfig, EspConfigType } from '@config/api';
import { WsClientService } from '@api/common/ws/ws-client.service';
import { PzemsGateway } from '../pzems.gateway';
import { PzemsService } from './pzems.service';
import { CreatePzemDto } from '../dto';

@Injectable()
export class PzemsWsService extends WsClientService {
  constructor(
    @Inject(EspConfig.KEY)
    espConfig: EspConfigType,
    private readonly pzemsGateway: PzemsGateway,
    private readonly pzemsService: PzemsService,
  ) {
    super(espConfig.wsEndpoint);
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
