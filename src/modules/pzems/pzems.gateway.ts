import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WebSocketServer as WsServer } from 'ws';
import { EspSensorsData } from '@api/modules';
import { ESP_SENSORS_EVENT } from '@api/modules/esp/esp.constants';
import { PzemsService } from './pzems.service';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({ path: 'pzems' })
export class PzemsGateway {
  @WebSocketServer()
  private server!: WsServer;

  constructor(private readonly pzemsService: PzemsService) {}

  @OnEvent(ESP_SENSORS_EVENT)
  async handleEspMessage(data: EspSensorsData, raw: string): Promise<void> {
    const message = await this.pzemsService.handleEspMessage(data, raw);

    if (!this.server.clients.size) {
      return;
    }

    this.server.clients.forEach((client) => {
      client.send(message);
    });
  }
}
