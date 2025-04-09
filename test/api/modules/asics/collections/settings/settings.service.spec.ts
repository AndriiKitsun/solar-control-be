import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { HttpServiceMock } from '../../../../services/mocks/http-service.mock';
import { AsicsSettingsApiService } from '@api/modules/asics';
import { AsicsHttpBaseApiServiceMock } from '../../services/mocks/http-base.service.mock';
import { AsicsAuthApiServiceMock } from '../auth/mocks/auth.service.mock';
import { AsicsSettingsApiServiceMock } from './mocks/settings.service.mock';

describe('AsicsSettingsApiService', () => {
  let service: AsicsSettingsApiService;

  let getSpy: jest.SpyInstance;
  let postSpy: jest.SpyInstance;
  let buildUrlSpy: jest.SpyInstance;

  const { urlMock, responseDataMock } = HttpServiceMock;
  const { ipMock } = AsicsHttpBaseApiServiceMock;
  const { tokenMock } = AsicsAuthApiServiceMock;
  const { asicSettingMock } = AsicsSettingsApiServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsSettingsApiService,
        {
          provide: HttpService,
          useClass: HttpServiceMock,
        },
      ],
    }).compile();

    service = module.get(AsicsSettingsApiService);

    buildUrlSpy = jest
      .spyOn(service as any, 'buildUrl')
      .mockReturnValueOnce(urlMock);
    getSpy = jest
      .spyOn(service as any, 'get')
      .mockResolvedValue(responseDataMock);
    postSpy = jest
      .spyOn(service as any, 'post')
      .mockResolvedValue(responseDataMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSettings', () => {
    it('should return asic settings', async () => {
      const expectedConfig = { headers: { Authorization: tokenMock } };

      const result = await service.getSettings(ipMock, tokenMock);

      expect(buildUrlSpy).toHaveBeenCalledWith(ipMock, 'settings');
      expect(getSpy).toHaveBeenCalledWith(urlMock, expectedConfig);

      expect(result).toBe(responseDataMock);
    });
  });

  describe('saveSettings', () => {
    it('should return setting save result', async () => {
      const expectedConfig = { headers: { Authorization: tokenMock } };

      const result = await service.saveSettings(
        ipMock,
        tokenMock,
        asicSettingMock,
      );

      expect(buildUrlSpy).toHaveBeenCalledWith(ipMock, 'settings');
      expect(postSpy).toHaveBeenCalledWith(
        urlMock,
        asicSettingMock,
        expectedConfig,
      );

      expect(result).toBe(responseDataMock);
    });
  });
});
