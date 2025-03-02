import { ClassMock } from '@common/types/test.types';
import { LogParams } from '@modules/logs/params';
import { LogsService } from '@modules/logs/logs.service';
import { Log } from '@modules/logs/entities';
import { CreateLogDto } from '@modules/logs/dto';
import { LogPayload } from '@modules/logs/logs.types';
import { Observable, of } from 'rxjs';
import { MessageEvent } from '@nestjs/common';
import { LogsRepositoryMock } from './logs.repository.mock';

export class LogsServiceMock implements ClassMock<LogsService> {
  async getLogs(params: LogParams): Promise<Log[]> {
    return LogsRepositoryMock.logsMock;
  }

  getLogStream(): Observable<MessageEvent> {
    return of({ data: LogsRepositoryMock.logMock });
  }

  async saveLog(logDto: CreateLogDto): Promise<void> {
    return;
  }

  async deleteLogs(): Promise<void> {
    return;
  }

  debug(logDto: LogPayload): void {}

  info(logDto: LogPayload): void {}

  warn(logDto: LogPayload): void {}

  error(logDto: LogPayload): void {}
}
