import { Test } from '@nestjs/testing';
import { AsicsApiService } from '@api/modules';
import { HttpService } from '@nestjs/axios';
import { AsicsApiServiceMock } from './mocks/asics.service.mock';
import { LoggerServiceMock } from '@common/mocks/logger.service.mock';
import { HttpServiceMock } from '../../services/mocks/http-service.mock';

describe('AsicsApiService', () => {
  let service: AsicsApiService;

  let getSpy: jest.SpyInstance;
  let buildUrlSpy: jest.SpyInstance;

  const ipMock = '192.168.0.1';

  const { urlMock, responseDataMock } = HttpServiceMock;
  const { asicSummaryMock, asicSummaryStatsMock } = AsicsApiServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsApiService,
        {
          provide: HttpService,
          useClass: HttpServiceMock,
        },
      ],
    }).compile();

    module.useLogger(new LoggerServiceMock());

    service = module.get(AsicsApiService);

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

  describe('getSummary', () => {
    it('should return summary', async () => {
      getSpy.mockResolvedValueOnce(asicSummaryStatsMock);

      const result = await service.getSummary(ipMock);

      expect(buildUrlSpy).toHaveBeenCalledWith(ipMock, ['summary']);
      expect(getSpy).toHaveBeenCalledWith(urlMock);

      expect(result).toBe(asicSummaryMock);
    });
  });

  describe('getPerfSummary', () => {
    it('should return perf summary', async () => {
      const result = await service.getPerfSummary(ipMock);

      expect(buildUrlSpy).toHaveBeenCalledWith(ipMock, ['perf-summary']);
      expect(getSpy).toHaveBeenCalledWith(urlMock);

      expect(result).toBe(responseDataMock);
    });

    it('should return null in case when endpoint is not reachable', async () => {
      getSpy.mockRejectedValueOnce(new Error('Not Found'));

      const result = await service.getPerfSummary(ipMock);

      expect(result).toBeNull();
    });
  });
});
