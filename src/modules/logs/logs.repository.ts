import { Injectable } from '@nestjs/common';
import { Log } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateLogDto } from './dto';
import { LogParams } from './params';

@Injectable()
export class LogsRepository {
  constructor(
    @InjectRepository(Log)
    private readonly repository: Repository<Log>,
  ) {}

  getLogs(params: LogParams): Promise<Log[]> {
    if (!params.from && !params.to) {
      return this.repository.find({
        where: {
          type: params.type,
        },
      });
    }

    const to = params.to ? new Date(params.to) : new Date();
    const from = params.from ? new Date(params.from) : new Date();

    return this.repository.find({
      where: {
        type: params.type,
        createdAt: Between(from, to),
      },
    });
  }

  async saveLog(logDto: CreateLogDto): Promise<Log> {
    await this.repository.insert(logDto);

    return logDto as Log;
  }

  async deleteAll(): Promise<void> {
    await this.repository.delete({});
  }
}
