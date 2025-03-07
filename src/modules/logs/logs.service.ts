import { Injectable, MessageEvent } from '@nestjs/common';
import { LogsRepository } from './logs.repository';
import { Log } from './entities';
import { CreateLogDto } from './dto';
import { Subject, Observable, map } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { LogParams } from './params';
import { LogLevel } from './enums';
import { LogPayload, RunWithLogOptions } from './logs.types';

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

  async saveLog(logDto: CreateLogDto): Promise<void> {
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

  async runWith<T>(
    callback: () => Promise<T>,
    options: RunWithLogOptions,
  ): Promise<T | void> {
    try {
      this.debug(options.before);

      return await callback();
    } catch {
      this.warn(options.after);
    }
  }
}
