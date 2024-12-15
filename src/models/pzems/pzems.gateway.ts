import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WebSocketServer as WsServer } from 'ws';

@WebSocketGateway({ path: 'pzems' })
export class PzemsGateway {
  @WebSocketServer()
  private server!: WsServer;

  emitData(message: string): void {
    if (!this.server.clients.size) {
      return;
    }

    this.server.clients.forEach((client) => {
      client.send(message);
    });
  }
}
