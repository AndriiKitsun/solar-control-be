import { Injectable, BadRequestException } from '@nestjs/common';
import { Pzem } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { PzemWithVoltage, PzemDtoToSave } from './pzems.types';

@Injectable()
export class PzemsRepository {
  constructor(
    @InjectRepository(Pzem)
    private readonly pzemsRepository: Repository<Pzem>,
  ) {}

  async create(createPzemDto: PzemDtoToSave): Promise<PzemDtoToSave> {
    try {
      await this.pzemsRepository.insert(createPzemDto);

      return createPzemDto;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll(): Promise<Pzem[]> {
    return this.pzemsRepository.find();
  }

  findAllBeforeMinutes(date: string, min: number): Promise<PzemWithVoltage[]> {
    const pastDate = new Date(date);
    pastDate.setMinutes(pastDate.getMinutes() - min);

    return this.pzemsRepository.find({
      where: {
        createdAtGmt: Between(pastDate, new Date(date)),
      },
      select: {
        voltageV: true,
      },
    });
  }
}
