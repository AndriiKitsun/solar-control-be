import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { WebSocketServer as WsServer } from 'ws';
import { EspWsServiceInterface, EspSensorsData } from '@api/modules';
import { Inject } from '@nestjs/common';
import { ESP_WS_SERVICE } from '@api/modules/esp/esp.constants';
import { PzemsService } from './pzems.service';

@WebSocketGateway({ path: 'pzems' })
export class PzemsGateway implements OnGatewayInit {
  @WebSocketServer()
  private server!: WsServer;

  constructor(
    @Inject(ESP_WS_SERVICE)
    private readonly espWsService: EspWsServiceInterface,
    private readonly pzemsService: PzemsService,
  ) {}

  afterInit(): void {
    this.espWsService.events.on(
      'message',
      (data: EspSensorsData, raw: string) => {
        void this.handleEspMessage(data, raw);
      },
    );
  }

  async handleEspMessage(data: EspSensorsData, raw: string): Promise<void> {
    const message = await this.pzemsService.handleSensors(data, raw);

    if (!this.server.clients.size) {
      return;
    }

    this.server.clients.forEach((client) => {
      client.send(message);
    });
  }
}
