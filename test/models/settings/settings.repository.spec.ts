import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Setting } from '@models/settings/entities';
import { SettingsRepository } from '@models/settings/settings.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RepositoryMock } from '@common/mocks/repository.mock';
import { SaveSettingsDtoMock } from './dto/mocks/save-settings.dto.mock';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SettingEntityMock } from './entities/mocks/setting.entity.mock';
import { IdParamMock } from '@common/params/mocks/id.param.mock';

describe('SettingsRepository', () => {
  let repository: SettingsRepository;
  let settingRepository: Repository<Setting>;

  const { saveSettingsDtoMock } = SaveSettingsDtoMock;
  const { settingMock } = SettingEntityMock;
  const { idMock } = IdParamMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsRepository,
        {
          provide: getRepositoryToken(Setting),
          useClass: RepositoryMock<Setting>,
        },
      ],
    }).compile();

    repository = module.get(SettingsRepository);
    settingRepository = module.get(getRepositoryToken(Setting));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    let insertSpy: jest.SpyInstance;

    beforeEach(() => {
      insertSpy = jest.spyOn(settingRepository, 'insert');
    });

    it('should return added entity', async () => {
      const result = await repository.create(saveSettingsDtoMock);

      expect(insertSpy).toHaveBeenCalledWith(saveSettingsDtoMock);

      expect(result).toEqual(saveSettingsDtoMock);
    });

    it('should throw error in case of failed insert', async () => {
      insertSpy.mockRejectedValueOnce(new Error('error'));

      const cb = () => repository.create(saveSettingsDtoMock);

      await expect(cb).rejects.toThrow(BadRequestException);
    });
  });

  describe('getSettings', () => {
    let findSpy: jest.SpyInstance;

    beforeEach(() => {
      findSpy = jest.spyOn(settingRepository, 'find');
    });

    it('should return first setting from response', async () => {
      findSpy.mockResolvedValueOnce([settingMock]);

      const result = await repository.getSettings();

      expect(findSpy).toHaveBeenCalled();

      expect(result).toBe(settingMock);
    });

    it('should return default created setting', async () => {
      const createSpy = jest
        .spyOn(repository, 'create')
        .mockResolvedValueOnce(settingMock);

      findSpy.mockResolvedValueOnce([]);

      const result = await repository.getSettings();

      expect(createSpy).toHaveBeenCalledWith({});

      expect(result).toBe(settingMock);
    });
  });

  describe('update', () => {
    let updateSpy: jest.SpyInstance;

    beforeEach(() => {
      updateSpy = jest.spyOn(settingRepository, 'update');
    });

    it('should update setting', async () => {
      const getSettingsSpy = jest
        .spyOn(repository, 'getSettings')
        .mockResolvedValueOnce(settingMock);

      updateSpy.mockResolvedValueOnce({ affected: 1 });

      const result = await repository.update(idMock, saveSettingsDtoMock);

      expect(updateSpy).toHaveBeenCalledWith(idMock, saveSettingsDtoMock);
      expect(getSettingsSpy).toHaveBeenCalled();

      expect(result).toBe(settingMock);
    });

    it('should throw error in case when no affected entity', async () => {
      updateSpy.mockResolvedValueOnce({ affected: 0 });

      const cb = () => repository.update(idMock, saveSettingsDtoMock);

      await expect(cb).rejects.toThrow(NotFoundException);
    });
  });
});
