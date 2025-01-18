import { Injectable, BadRequestException } from '@nestjs/common';
import { Pzem } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not, IsNull } from 'typeorm';
import { EspPzemData } from '@api/modules';
import { toError } from '@common/utils';
import { RecentPzemForCalc } from './pzems.types';

@Injectable()
export class PzemsRepository {
  constructor(
    @InjectRepository(Pzem)
    private readonly pzemsRepository: Repository<Pzem>,
  ) {}

  async create(pzemData: EspPzemData): Promise<Pzem> {
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
        pzems: {
          name: true,
          voltageV: true,
        },
      },
      relations: {
        pzems: true,
      },
      where: {
        createdAtGmt: Between(fromDate, toDate),
        pzems: {
          voltageV: Not(IsNull()),
        },
      },
      order: {
        createdAtGmt: 'DESC',
      },
    });
  }

  async findRecentForCalc(
    date: string,
    minutes: number,
  ): Promise<Record<string, RecentPzemForCalc>> {
    const fromDate = new Date(date);
    fromDate.setMinutes(fromDate.getMinutes() - minutes);
    fromDate.setMilliseconds(0);

    const pzems = await this.pzemsRepository
      .createQueryBuilder('pzem')
      .leftJoinAndSelect('pzem.pzems', 'pzems')
      .select(['pzems.name as name', 'SUM(pzems.voltageV)', 'COUNT(*)::int'])
      .where('pzem.createdAtGmt BETWEEN :from AND :to', {
        from: fromDate,
        to: new Date(date),
      })
      .andWhere('pzems.voltageV IS NOT NULL')
      .groupBy('pzems.name')
      .getRawMany<RecentPzemForCalc>();

    return pzems.reduce((acc: Record<string, RecentPzemForCalc>, pzem) => {
      acc[pzem.name] = pzem;

      return acc;
    }, {});
  }
}
