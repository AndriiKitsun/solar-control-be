import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WebSocketServer as WsServer } from 'ws';

@WebSocketGateway({ path: 'pzems' })
export class PzemsGateway {
  @WebSocketServer()
  private server: WsServer;

  emitData(data: Record<string, any>): void {
    const payload = JSON.stringify(data);

    this.server.clients.forEach((client) => {
      client.send(payload);
    });
  }
}
