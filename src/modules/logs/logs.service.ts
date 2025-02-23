import { Injectable, MessageEvent } from '@nestjs/common';
import { LogsRepository } from './logs.repository';
import { Log } from './entities';
import { LogDto } from './dto';
import { Subject, Observable, map } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { LogParams } from './params';
import { LogLevel } from './enums';
import { LogPayload } from './logs.types';

@Injectable()
export class LogsService {
  private readonly logs$ = new Subject<Log>();

  constructor(private readonly logsRepository: LogsRepository) {}

  getLogs(params: LogParams): Promise<Log[]> {
    return this.logsRepository.getLogs(params);
  }

  getLogStream(): Observable<MessageEvent> {
    return this.logs$.pipe(map((data) => ({ data })));
  }

  async saveLog(logDto: LogDto): Promise<void> {
    await this.logsRepository.saveLog(logDto);

    this.logs$.next(plainToClass(Log, logDto));
  }

  deleteLogs(): Promise<void> {
    return this.logsRepository.deleteAll();
  }

  debug(logDto: LogPayload): void {
    void this.saveLog({ ...logDto, level: LogLevel.DEBUG });
  }

  info(logDto: LogPayload): void {
    void this.saveLog({ ...logDto, level: LogLevel.INFO });
  }

  warn(logDto: LogPayload): void {
    void this.saveLog({ ...logDto, level: LogLevel.WARN });
  }

  error(logDto: LogPayload): void {
    void this.saveLog({ ...logDto, level: LogLevel.ERROR });
  }
}
