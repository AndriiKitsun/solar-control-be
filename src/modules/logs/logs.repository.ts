import { Injectable } from '@nestjs/common';
import { Log } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateLogDto } from './dto';
import { LogParams } from './params';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

@Injectable()
export class LogsRepository {
  constructor(
    @InjectRepository(Log)
    private readonly repository: Repository<Log>,
  ) {}

  async getLogs(params: LogParams): Promise<Log[]> {
    const where: FindOptionsWhere<Log> = {};
    const opts: FindManyOptions<Log> = { where };

    if (params.from && params.to) {
      where.createdAt = Between(new Date(params.from), new Date(params.to));
    }

    if (params.type) {
      where.type = params.type;
    }

    if (params.order) {
      opts.order = { createdAt: params.order };
    }

    return this.repository.find(opts);
  }

  async saveLog(logDto: CreateLogDto): Promise<Log> {
    await this.repository.insert(logDto);

    return logDto as Log;
  }

  async deleteAll(): Promise<void> {
    await this.repository.delete({});
  }
}
