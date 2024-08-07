import { Injectable, Inject, Logger } from '@nestjs/common';
import { EspConfigType, EspConfig } from '@config/api';
import { WebSocket } from 'ws';
import { PzemsGateway } from './pzems.gateway';

@Injectable()
export class PzemsWebSocketService {
  private logger = new Logger(PzemsWebSocketService.name);

  private wsClient: WebSocket;

  private heartbeatInterval = 30000;
  private heartbeatTimeout: NodeJS.Timeout;

  constructor(
    @Inject(EspConfig.KEY)
    private readonly espConfig: EspConfigType,
    private readonly pzemsGateway: PzemsGateway,
  ) {
    this.connect();
  }

  private connect(): void {
    this.wsClient = new WebSocket(this.espConfig.wsEndpoint);

    this.wsClient.on('open', () => {
      this.logger.verbose(
        `Connected to the server ${this.espConfig.wsEndpoint}`,
      );

      this.startHeartbeat();
    });

    this.wsClient.on('ping', () => {
      this.logger.verbose(`Ping received from ${this.espConfig.wsEndpoint}`);

      this.wsClient.pong();
    });

    this.wsClient.on('pong', () => {
      this.logger.verbose(`Pong received from ${this.espConfig.wsEndpoint}`);
    });

    this.wsClient.on('close', (code: number, reason: string) => {
      this.logger.verbose(`Disconnected from the server: ${code} ${reason}`);

      this.terminate();
      this.reconnect();
    });

    this.wsClient.on('error', (error) => {
      this.logger.error(error);

      this.terminate();
    });

    this.wsClient.on('message', (data: Buffer) => {
      this.handleMessage(JSON.parse(data.toString()));
    });
  }

  private handleMessage(pzems: Record<string, any>): void {
    this.pzemsGateway.emitData(pzems);
  }

  private startHeartbeat(): void {
    if (this.heartbeatTimeout) {
      clearInterval(this.heartbeatTimeout);
    }

    this.heartbeatTimeout = setInterval(() => {
      if (this.wsClient.readyState === WebSocket.OPEN) {
        this.logger.verbose(`Ping ${this.espConfig.wsEndpoint} server`);

        this.wsClient.ping();
      }
    }, this.heartbeatInterval);
  }

  private reconnect(): void {
    this.logger.verbose(`Reconnect to the server ${this.espConfig.wsEndpoint}`);

    this.connect();
  }

  private terminate(): void {
    this.wsClient.terminate();
  }
}
