import { Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto';
import { SettingsRepository } from './settings.repository';
import { Setting } from './entities';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  create(createSettingDto: CreateSettingDto): Promise<Setting> {
    return this.settingsRepository.create(createSettingDto);
  }

  async findAll(): Promise<Setting> {
    const settings = await this.settingsRepository.findAll();

    return settings[0];
  }
}
