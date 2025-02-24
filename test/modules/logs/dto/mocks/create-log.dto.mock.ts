import { CreateLogDto, LogType, LogLevel } from '@modules/logs';

export class CreateLogDtoMock {
  static readonly createLogDtoMock: CreateLogDto = {
    type: LogType.PROTECTION,
    level: LogLevel.INFO,
    message: 'log message',
  };
}
