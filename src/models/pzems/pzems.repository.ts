import { Injectable, BadRequestException } from '@nestjs/common';
import { Pzem } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecentPzemForCalc } from './pzems.types';
import { EspPzemData } from '@api/modules';

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
      throw new BadRequestException((error as Error).message);
    }
  }

  async findRecentForCalc(
    date: string,
    minutes: number,
  ): Promise<Record<string, RecentPzemForCalc>> {
    const fromDate = new Date(date);
    fromDate.setMinutes(fromDate.getMinutes() - minutes);

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

    return pzems.reduce((obj, pzem) => ({ ...obj, [pzem.name]: pzem }), {});
  }
}
