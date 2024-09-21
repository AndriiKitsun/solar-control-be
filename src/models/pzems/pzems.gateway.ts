import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WebSocketServer as WsServer } from 'ws';
import { Pzem } from './entities';
import { CreatePzemDto } from './dto';

@WebSocketGateway({ path: 'pzems' })
export class PzemsGateway {
  @WebSocketServer()
  private server: WsServer;

  emitData(pzem: Pzem | CreatePzemDto): void {
    if (!this.server.clients.size) {
      return;
    }

    const payload = JSON.stringify(pzem);

    this.server.clients.forEach((client) => {
      client.send(payload);
    });
  }
}
