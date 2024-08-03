import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Asic } from './entities';
import { CreateAsicDto, UpdateAsicDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityNotFoundError } from 'typeorm';

@Injectable()
export class AsicsRepository {
  constructor(
    @InjectRepository(Asic)
    private readonly asicsRepository: Repository<Asic>,
  ) {}

  async create(createAsicDto: CreateAsicDto): Promise<Asic> {
    try {
      await this.asicsRepository.insert(createAsicDto);

      return createAsicDto as Asic;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll(): Promise<Asic[]> {
    return this.asicsRepository.find();
  }

  async findOne(id: string): Promise<Asic> {
    try {
      return await this.asicsRepository.findOneByOrFail({ id });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Asic with '${id}' id does not exist`);
      }

      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateAsicDto: UpdateAsicDto): Promise<Asic> {
    const result = await this.asicsRepository.update(id, updateAsicDto);

    if (!result.affected) {
      throw new NotFoundException(`Asic with '${id}' id does not exist`);
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.asicsRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Asic with '${id}' id does not exist`);
    }
  }
}
