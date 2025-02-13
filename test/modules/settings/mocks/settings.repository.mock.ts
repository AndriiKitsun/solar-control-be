import { ClassMock } from '@common/types/test.types';
import { SettingsRepository } from '../../../../src/modules/settings/settings.repository';
import { SaveSettingsDto } from '../../../../src/modules/settings/dto';
import { Setting } from '../../../../src/modules/settings/entities';
import { SettingEntityMock } from '../entities/mocks/setting.entity.mock';

export class SettingsRepositoryMock implements ClassMock<SettingsRepository> {
  async create(saveSettingDto: SaveSettingsDto): Promise<Setting> {
    return SettingEntityMock.settingMock;
  }

  async getSettings(): Promise<Setting> {
    return SettingEntityMock.settingMock;
  }

  async update(
    id: string,
    updateSettingDto: SaveSettingsDto,
  ): Promise<Setting> {
    return SettingEntityMock.settingMock;
  }
}
