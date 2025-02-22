import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WebSocketServer as WsServer } from 'ws';
import { ESP_SENSORS_EVENT } from '@api/modules/esp/constants/esp.constants';
import { SensorsService } from './sensors.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EspSensorsData } from '@api/modules/esp';

@WebSocketGateway({ path: 'sensors' })
export class SensorsGateway {
  @WebSocketServer()
  private server!: WsServer;

  constructor(private readonly sensorsService: SensorsService) {}

  @OnEvent(ESP_SENSORS_EVENT)
  async handleEspMessage(data: EspSensorsData, raw: string): Promise<void> {
    const message = await this.sensorsService.handleEspMessage(data, raw);

    if (!this.server.clients.size) {
      return;
    }

    this.server.clients.forEach((client) => {
      client.send(message);
    });
  }
}
