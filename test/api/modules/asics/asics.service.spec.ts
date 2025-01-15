import { Test, TestingModule } from '@nestjs/testing';
import { AsicsApiService } from '@api/modules';
import { HttpService } from '@nestjs/axios';
import { HttpServiceMock } from '../../common/services/mocks/http-service.mock';
import { AsicsApiServiceMock } from './mocks/asics.service.mock';

describe('AsicsApiService', () => {
  let service: AsicsApiService;

  let getSpy: jest.SpyInstance;
  let buildUrl: jest.SpyInstance;

  const ipMock = '192.168.0.1';

  const { urlMock, responseDataMock } = HttpServiceMock;
  const { asicSummaryMock, asicSummaryStats } = AsicsApiServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AsicsApiService,
        {
          provide: HttpService,
          useClass: HttpServiceMock,
        },
      ],
    }).compile();

    service = module.get(AsicsApiService);

    buildUrl = jest
      .spyOn(service as any, 'buildUrl')
      .mockReturnValueOnce(urlMock);
    getSpy = jest.spyOn(service, 'get').mockResolvedValue(responseDataMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSummary', () => {
    it('should return miner stats', async () => {
      getSpy.mockResolvedValueOnce(asicSummaryStats);

      const result = await service.getSummary(ipMock);

      expect(buildUrl).toHaveBeenCalledTimes(1);
      expect(buildUrl).toHaveBeenCalledWith(ipMock, ['summary']);

      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledWith(urlMock);

      expect(result).toBe(asicSummaryMock);
    });
  });
});
