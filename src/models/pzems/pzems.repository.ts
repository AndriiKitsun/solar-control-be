import { Injectable, BadRequestException } from '@nestjs/common';
import { Pzem } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not, IsNull } from 'typeorm';
import { EspSensorsData } from '@api/modules';
import { toError } from '@common/utils';

@Injectable()
export class PzemsRepository {
  constructor(
    @InjectRepository(Pzem)
    private readonly pzemsRepository: Repository<Pzem>,
  ) {}

  async create(pzemData: EspSensorsData): Promise<Pzem> {
    try {
      return await this.pzemsRepository.save(pzemData);
    } catch (error) {
      throw new BadRequestException(toError((error as Error).message));
    }
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
