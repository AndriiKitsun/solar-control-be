import { Injectable, BadRequestException } from '@nestjs/common';
import { Pzem } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePzemDto } from './dto';
import { RecentPzemForCalc } from './pzems.types';

@Injectable()
export class PzemsRepository {
  constructor(
    @InjectRepository(Pzem)
    private readonly pzemsRepository: Repository<Pzem>,
  ) {}

  async create(createPzemDto: CreatePzemDto): Promise<Pzem> {
    try {
      return await this.pzemsRepository.save(createPzemDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll(): Promise<Pzem[]> {
    return this.pzemsRepository.find({
      relations: {
        pzems: true,
      },
      order: {
        createdAtGmt: {
          direction: 'desc',
        },
      },
    });
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
