import { LogParams } from '@modules/logs/params';
import { LogType } from '@modules/logs/enums';

export class LogParamsMock {
  static readonly logParamsMock: LogParams = {
    from: '2025-02-24',
    to: '2025-02-25',
    type: LogType.PROTECTION,
  };
}
