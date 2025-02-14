import { Injectable } from '@nestjs/common';
import { Asic } from './entities';
import { UpdateAsicDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityNotFoundError } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AsicsRepository {
  constructor(
    @InjectRepository(Asic)
    private readonly asicsRepository: Repository<Asic>,
  ) {}

  async create(createAsicDto: Partial<Asic>): Promise<Asic> {
    await this.asicsRepository.insert(createAsicDto);

    return plainToInstance(Asic, createAsicDto);
  }

  findAll(): Promise<Asic[]> {
    return this.asicsRepository.find();
  }

  findOne(id: string): Promise<Asic> {
    return this.asicsRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateAsicDto: UpdateAsicDto): Promise<Asic> {
    const result = await this.asicsRepository.update(id, updateAsicDto);

    if (!result.affected) {
      throw new EntityNotFoundError(Asic, { id });
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.asicsRepository.delete(id);

    if (!result.affected) {
      throw new EntityNotFoundError(Asic, { id });
    }
  }
}
