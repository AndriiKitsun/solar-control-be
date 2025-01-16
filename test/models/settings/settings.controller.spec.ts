import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from '@models/settings/settings.controller';
import { SettingsService } from '@models/settings/settings.service';
import { SettingEntityMock } from './entities/mocks/setting.entity.mock';
import { IdParamMock } from '@common/params/mocks/id.param.mock';
import { SaveSettingsDtoMock } from './dto/mocks/save-settings.dto.mock';
import { SettingsServiceMock } from './mocks/settings.service.mock';

describe('SettingsController', () => {
  let controller: SettingsController;
  let settingsService: SettingsService;

  const { settingMock } = SettingEntityMock;
  const { idParamsMock, idMock } = IdParamMock;
  const { saveSettingsDtoMock } = SaveSettingsDtoMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        {
          provide: SettingsService,
          useClass: SettingsServiceMock,
        },
      ],
    }).compile();

    controller = module.get(SettingsController);
    settingsService = module.get(SettingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSettings', () => {
    it('should return setting', async () => {
      const getSettingsSpy = jest.spyOn(settingsService, 'getSettings');

      const result = await controller.getSettings();

      expect(getSettingsSpy).toHaveBeenCalled();

      expect(result).toBe(settingMock);
    });
  });

  describe('updateSettings', () => {
    it('should update setting', async () => {
      const updateSettingsSpy = jest.spyOn(settingsService, 'updateSettings');

      const result = await controller.updateSettings(
        idParamsMock,
        saveSettingsDtoMock,
      );

      expect(updateSettingsSpy).toHaveBeenCalled();
      expect(updateSettingsSpy).toHaveBeenCalledWith(
        idMock,
        saveSettingsDtoMock,
      );

      expect(result).toBe(settingMock);
    });
  });
});
