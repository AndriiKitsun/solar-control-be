import { Injectable } from '@nestjs/common';
import { Asic } from './entities';
import { UpdateAsicDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityNotFoundError } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ASICS_CACHE_CONFIG } from './asics.constants';
import { getCacheKey } from '@common/utils';

@Injectable()
export class AsicsRepository {
  constructor(
    @InjectRepository(Asic)
    private readonly asicsRepository: Repository<Asic>,
  ) {}

  async create(createAsicDto: Partial<Asic>): Promise<Asic> {
    await this.asicsRepository.insert(createAsicDto);

    await this.asicsRepository.manager.connection.queryResultCache?.remove([
      ASICS_CACHE_CONFIG.getAsics.id,
    ]);

    return plainToInstance(Asic, createAsicDto);
  }

  findAll(): Promise<Asic[]> {
    return this.asicsRepository.find({
      cache: ASICS_CACHE_CONFIG.getAsics,
    });
  }

  findOne(id: string): Promise<Asic> {
    return this.asicsRepository.findOneOrFail({
      where: { id },
      cache: {
        id: getCacheKey(ASICS_CACHE_CONFIG.getAsic.id, id),
        milliseconds: ASICS_CACHE_CONFIG.getAsic.milliseconds,
      },
    });
  }

  async update(id: string, updateAsicDto: UpdateAsicDto): Promise<Asic> {
    const result = await this.asicsRepository.update(id, updateAsicDto);

    if (!result.affected) {
      throw new EntityNotFoundError(Asic, { id });
    }

    await this.asicsRepository.manager.connection.queryResultCache?.remove([
      ASICS_CACHE_CONFIG.getAsics.id,
      getCacheKey(ASICS_CACHE_CONFIG.getAsic.id, id),
    ]);

    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.asicsRepository.delete(id);

    if (!result.affected) {
      throw new EntityNotFoundError(Asic, { id });
    }

    await this.asicsRepository.manager.connection.queryResultCache?.remove([
      ASICS_CACHE_CONFIG.getAsics.id,
      getCacheKey(ASICS_CACHE_CONFIG.getAsic.id, id),
    ]);
  }
}
