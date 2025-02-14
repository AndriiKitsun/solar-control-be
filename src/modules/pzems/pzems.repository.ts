import { Injectable } from '@nestjs/common';
import { Pzem } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not, IsNull } from 'typeorm';

@Injectable()
export class PzemsRepository {
  constructor(
    @InjectRepository(Pzem)
    private readonly pzemsRepository: Repository<Pzem>,
  ) {}

  save(sensorsData: Pzem): Promise<Pzem> {
    return this.pzemsRepository.save(sensorsData);
  }

  findAllBefore(date: Date | string, seconds: number): Promise<Pzem[]> {
    const fromDate = new Date(date);
    fromDate.setSeconds(fromDate.getSeconds() - seconds);
    fromDate.setMilliseconds(0);

    const toDate = new Date(date);
    toDate.setMilliseconds(999);

    return this.pzemsRepository.find({
      select: {
        createdAtGmt: true,
        sensors: {
          name: true,
          voltage: true,
        },
      },
      relations: {
        sensors: true,
      },
      where: {
        createdAtGmt: Between(fromDate, toDate),
        sensors: {
          voltage: Not(IsNull()),
        },
      },
      order: {
        createdAtGmt: 'DESC',
      },
    });
  }

  async clearPzemTable(): Promise<void> {
    await this.pzemsRepository.delete({});
  }
}
