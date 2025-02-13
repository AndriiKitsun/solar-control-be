import { ClassMock } from '@common/types/test.types';
import { SaveSettingsDto } from '../../../../src/modules/settings/dto';
import { Setting } from '../../../../src/modules/settings/entities';
import { SettingEntityMock } from '../entities/mocks/setting.entity.mock';
import { SettingsService } from '../../../../src/modules/settings/settings.service';

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
