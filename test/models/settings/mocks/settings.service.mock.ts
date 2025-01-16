import { ClassMock } from '@common/types/test.types';
import { SaveSettingsDto } from '@models/settings/dto';
import { Setting } from '@models/settings/entities';
import { SettingEntityMock } from '../entities/mocks/setting.entity.mock';
import { SettingsService } from '@models/settings/settings.service';

export class SettingsServiceMock implements ClassMock<SettingsService> {
  async getSettings(): Promise<Setting> {
    return SettingEntityMock.settingMock;
  }

  async updateSettings(
    id: string,
    saveSettingsDto: SaveSettingsDto,
  ): Promise<Setting> {
    return SettingEntityMock.settingMock;
  }
}
