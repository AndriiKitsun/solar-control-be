import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { HttpServiceMock } from '../../../../services/mocks/http-service.mock';
import { AsicsAutotuneApiService } from '@api/modules/asics';
import { AsicsHttpBaseApiServiceMock } from '../../services/mocks/http-base.service.mock';
import { AsicsAuthApiServiceMock } from '../auth/mocks/auth.service.mock';

describe('AsicsAutotuneApiService', () => {
  let service: AsicsAutotuneApiService;

  let getSpy: jest.SpyInstance;
  let buildUrlSpy: jest.SpyInstance;

  const { urlMock, responseDataMock } = HttpServiceMock;
  const { ipMock } = AsicsHttpBaseApiServiceMock;
  const { tokenMock } = AsicsAuthApiServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsAutotuneApiService,
        {
          provide: HttpService,
          useClass: HttpServiceMock,
        },
      ],
    }).compile();

    service = module.get(AsicsAutotuneApiService);

    buildUrlSpy = jest
      .spyOn(service as any, 'buildUrl')
      .mockReturnValueOnce(urlMock);
    getSpy = jest
      .spyOn(service as any, 'get')
      .mockResolvedValue(responseDataMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPresets', () => {
    it('should return asic presets', async () => {
      const expectedConfig = { headers: { Authorization: tokenMock } };

      const result = await service.getPresets(ipMock, tokenMock);

      expect(buildUrlSpy).toHaveBeenCalledWith(ipMock, 'autotune/presets');
      expect(getSpy).toHaveBeenCalledWith(urlMock, expectedConfig);

      expect(result).toBe(responseDataMock);
    });
  });
});
