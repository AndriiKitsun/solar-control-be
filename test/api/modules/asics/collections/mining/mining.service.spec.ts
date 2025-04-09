import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { HttpServiceMock } from '../../../../services/mocks/http-service.mock';
import { AsicsMiningApiService } from '@api/modules/asics';
import { AsicsHttpBaseApiServiceMock } from '../../services/mocks/http-base.service.mock';
import { AsicsAuthApiServiceMock } from '../auth/mocks/auth.service.mock';

describe('AsicsMiningApiService', () => {
  let service: AsicsMiningApiService;

  let postSpy: jest.SpyInstance;
  let buildUrlSpy: jest.SpyInstance;

  const { urlMock, responseDataMock } = HttpServiceMock;
  const { ipMock } = AsicsHttpBaseApiServiceMock;
  const { tokenMock } = AsicsAuthApiServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsMiningApiService,
        {
          provide: HttpService,
          useClass: HttpServiceMock,
        },
      ],
    }).compile();

    service = module.get(AsicsMiningApiService);

    buildUrlSpy = jest
      .spyOn(service as any, 'buildUrl')
      .mockReturnValueOnce(urlMock);
    postSpy = jest
      .spyOn(service as any, 'post')
      .mockResolvedValue(responseDataMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('start', () => {
    it('should send request to start asic', async () => {
      const expectedConfig = { headers: { Authorization: tokenMock } };

      const result = await service.start(ipMock, tokenMock);

      expect(buildUrlSpy).toHaveBeenCalledWith(ipMock, 'mining/start');
      expect(postSpy).toHaveBeenCalledWith(urlMock, null, expectedConfig);

      expect(result).toBe(responseDataMock);
    });
  });

  describe('stop', () => {
    it('should send request to stop asic', async () => {
      const expectedConfig = { headers: { Authorization: tokenMock } };

      const result = await service.stop(ipMock, tokenMock);

      expect(buildUrlSpy).toHaveBeenCalledWith(ipMock, 'mining/stop');
      expect(postSpy).toHaveBeenCalledWith(urlMock, null, expectedConfig);

      expect(result).toBe(responseDataMock);
    });
  });
});
