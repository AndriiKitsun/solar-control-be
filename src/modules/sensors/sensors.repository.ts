import { Injectable } from '@nestjs/common';
import { Sensor } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not, IsNull } from 'typeorm';

@Injectable()
export class SensorsRepository {
  constructor(
    @InjectRepository(Sensor)
    private readonly pzemsRepository: Repository<Sensor>,
  ) {}

  save(sensorsData: Sensor): Promise<Sensor> {
    return this.pzemsRepository.save(sensorsData);
  }

  findAllBefore(date: Date | string, seconds: number): Promise<Sensor[]> {
    const fromDate = new Date(date);
    fromDate.setSeconds(fromDate.getSeconds() - seconds);
    fromDate.setMilliseconds(0);

    const toDate = new Date(date);
    toDate.setMilliseconds(999);

    return this.pzemsRepository.find({
      select: {
        createdAt: true,
        sensors: {
          name: true,
          voltage: true,
        },
      },
      relations: {
        sensors: true,
      },
      where: {
        createdAt: Between(fromDate, toDate),
        sensors: {
          voltage: Not(IsNull()),
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async clearPzemTable(): Promise<void> {
    await this.pzemsRepository.delete({});
  }
}
