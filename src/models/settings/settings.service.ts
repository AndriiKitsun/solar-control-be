import { Injectable } from '@nestjs/common';
import { SaveSettingDto } from './dto';
import { SettingsRepository } from './settings.repository';
import { Setting } from './entities';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  getSettings(): Promise<Setting> {
    return this.settingsRepository.getSettings();
  }

  update(id: string, updateSettingDto: SaveSettingDto): Promise<Setting> {
    return this.settingsRepository.update(id, updateSettingDto);
  }
}
