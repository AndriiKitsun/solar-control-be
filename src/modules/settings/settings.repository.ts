import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityNotFoundError } from 'typeorm';
import { Setting } from './entities';
import { SaveSettingsDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SettingsRepository {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async create(saveSettingsDto: SaveSettingsDto): Promise<Setting> {
    await this.settingRepository.insert(saveSettingsDto);

    return plainToInstance(Setting, saveSettingsDto);
  }

  async getSettings(): Promise<Setting> {
    const setting = await this.settingRepository.find();

    if (!setting.length) {
      return this.create({});
    }

    return setting[0];
  }

  async update(id: string, saveSettingsDto: SaveSettingsDto): Promise<Setting> {
    const result = await this.settingRepository.update(id, saveSettingsDto);

    if (!result.affected) {
      throw new EntityNotFoundError(Setting, { id });
    }

    return this.getSettings();
  }
}
