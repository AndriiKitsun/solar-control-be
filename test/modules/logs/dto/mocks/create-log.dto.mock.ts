import { CreateLogDto } from '@modules/logs/dto';
import { LogType, LogLevel } from '@modules/logs/enums';

export class CreateLogDtoMock {
  static readonly createLogDtoMock: CreateLogDto = {
    type: LogType.PROTECTION,
    level: LogLevel.INFO,
    message: 'log message',
  };
}
