import { Injectable } from '@nestjs/common';
import { SaveSettingsDto } from './dto';
import { SettingsRepository } from './settings.repository';
import { Setting } from './entities';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  getSettings(): Promise<Setting> {
    return this.settingsRepository.getSettings();
  }

  updateSettings(
    id: string,
    saveSettingsDto: SaveSettingsDto,
  ): Promise<Setting> {
    return this.settingsRepository.update(id, saveSettingsDto);
  }
}
