import { Injectable } from '@nestjs/common';
import { LogsRepository } from './logs.repository';

@Injectable()
export class LogsService {
  constructor(private readonly logsRepository: LogsRepository) {}
}
