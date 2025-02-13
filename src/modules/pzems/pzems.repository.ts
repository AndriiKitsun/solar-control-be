import { Injectable } from '@nestjs/common';
import { Pzem } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not, IsNull } from 'typeorm';
import { EspSensorsData } from '@api/modules';

@Injectable()
export class PzemsRepository {
  constructor(
    @InjectRepository(Pzem)
    private readonly pzemsRepository: Repository<Pzem>,
  ) {}

  create(pzemData: EspSensorsData): Promise<Pzem> {
    return this.pzemsRepository.save(pzemData);
  }

  findAllBefore(date: string, seconds: number): Promise<Pzem[]> {
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
