import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities';
import { CreateSettingDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { toError } from '@common/utils';

@Injectable()
export class SettingsRepository {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async create(createSettingDto: CreateSettingDto): Promise<Setting> {
    try {
      // await this.settingRepository.insert(createSettingDto);

      const res = await this.settingRepository.save(createSettingDto);

      return plainToInstance(Setting, createSettingDto);
    } catch (error) {
      throw new BadRequestException(toError((error as Error).message));
    }
  }

  findAll(): Promise<Setting[]> {
    return this.settingRepository.find();
  }
}
