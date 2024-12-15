import { Logger } from '@nestjs/common';
import { WebSocket } from 'ws';

export abstract class WsClientService<T = any> {
  protected logger?: Logger = new Logger(WsClientService.name);
  protected heartbeatInterval: number = 30000;
  protected client: WebSocket | null;

  private heartbeatTimeout: NodeJS.Timeout;

  constructor(private readonly baseUrl: string) {
    this.connect();
  }

  protected connect(): void {
    this.client = new WebSocket(this.baseUrl);

    this.listenWsEvents();
  }

  protected listenWsEvents(): void {
    this.client!.on('open', () => {
      this.logger?.verbose(`Connected to the server ${this.baseUrl}`);

      this.startHeartbeat();
    });

    this.client!.on('ping', () => {
      this.logger?.verbose(`Ping received from ${this.baseUrl}`);

      this.client!.pong();
    });

    this.client!.on('pong', () => {
      this.logger?.verbose(`Pong received from ${this.baseUrl}`);
    });

    this.client!.on('close', (code: number, reason: string) => {
      this.logger?.verbose(`Disconnected from the server: ${code} ${reason}`);

      this.terminate();
      this.reconnect();
    });

    this.client!.on('error', (error) => {
      this.logger?.error(error);

      this.terminate();
    });

    this.client!.on('message', (data: Buffer) => {
      const message = data.toString();

      this.handleMessage(JSON.parse(message), message);
    });
  }

  private startHeartbeat(): void {
    if (this.heartbeatTimeout) {
      clearInterval(this.heartbeatTimeout);
    }

    this.heartbeatTimeout = setInterval(() => {
      if (this.client!.readyState === WebSocket.OPEN) {
        this.logger?.verbose(`Ping ${this.baseUrl} server`);

        this.client!.ping();
      }
    }, this.heartbeatInterval);
  }

  private reconnect(): void {
    this.logger?.verbose(`Reconnect to the server ${this.baseUrl}`);

    this.connect();
  }

  private terminate(): void {
    this.client?.terminate();
    this.client = null;
  }

  protected abstract handleMessage(data: T, rawMessage: string): Promise<void>;
}
