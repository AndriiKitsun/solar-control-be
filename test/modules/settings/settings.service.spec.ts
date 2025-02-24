import { Test } from '@nestjs/testing';
import { SettingsService } from '@modules/settings/settings.service';
import { SettingsRepository } from '@modules/settings/settings.repository';
import { SettingsRepositoryMock } from './mocks/settings.repository.mock';
import { SettingEntityMock } from './entities/mocks/setting.entity.mock';
import { SaveSettingsDtoMock } from './dto/mocks/save-settings.dto.mock';
import { IdParamMock } from '@common/params/mocks/id.param.mock';

describe('SettingsService', () => {
  let service: SettingsService;
  let settingsRepository: SettingsRepository;

  const { settingMock } = SettingEntityMock;
  const { idMock } = IdParamMock;
  const { saveSettingsDtoMock } = SaveSettingsDtoMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: SettingsRepository,
          useClass: SettingsRepositoryMock,
        },
      ],
    }).compile();

    service = module.get(SettingsService);
    settingsRepository = module.get(SettingsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSettings', () => {
    it('should return setting', async () => {
      const getSettingsSpy = jest.spyOn(settingsRepository, 'getSettings');

      const result = await service.getSettings();

      expect(getSettingsSpy).toHaveBeenCalled();

      expect(result).toBe(settingMock);
    });
  });

  describe('updateSettings', () => {
    it('should update setting', async () => {
      const updateSpy = jest.spyOn(settingsRepository, 'update');

      const result = await service.updateSettings(idMock, saveSettingsDtoMock);

      expect(updateSpy).toHaveBeenCalledWith(idMock, saveSettingsDtoMock);

      expect(result).toBe(settingMock);
    });
  });
});
