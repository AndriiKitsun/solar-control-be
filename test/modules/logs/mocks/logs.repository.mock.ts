import { ClassMock } from '@common/types/test.types';
import { LogsRepository } from '@modules/logs/logs.repository';
import { Log } from '@modules/logs/entities';
import { LogType, LogLevel } from '@modules/logs/enums';
import { LogParams } from '@modules/logs/params';
import { CreateLogDto } from '@modules/logs/dto';

export class LogsRepositoryMock implements ClassMock<LogsRepository> {
  static readonly logMock: Log = {
    id: 'id',
    type: LogType.PROTECTION,
    level: LogLevel.DEBUG,
    message: 'log message',
    createdAt: new Date(),
  };

  static readonly logsMock: Log[] = [this.logMock];

  async getLogs(params: LogParams): Promise<Log[]> {
    return LogsRepositoryMock.logsMock;
  }

  async saveLog(logDto: CreateLogDto): Promise<Log> {
    return logDto as Log;
  }

  async deleteAll(): Promise<void> {
    return;
  }
}
