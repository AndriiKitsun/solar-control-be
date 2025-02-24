import { ClassMock } from '@common/types/test.types';
import {
  LogsRepository,
  LogParams,
  Log,
  CreateLogDto,
  LogLevel,
  LogType,
} from '@modules/logs';

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
