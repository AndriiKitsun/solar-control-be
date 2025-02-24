import { LogParams, LogType } from '@modules/logs';

export class LogParamsMock {
  static readonly logParamsMock: LogParams = {
    from: '2025-02-24',
    to: '2025-02-25',
    type: LogType.PROTECTION,
  };
}
