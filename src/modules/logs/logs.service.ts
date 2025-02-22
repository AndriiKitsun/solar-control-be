import { Injectable, MessageEvent } from '@nestjs/common';
import { LogsRepository } from './logs.repository';
import { Log } from './entities';
import { LogDto } from './dto';
import { Subject, Observable, map } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { LogParams } from './params';

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
}
