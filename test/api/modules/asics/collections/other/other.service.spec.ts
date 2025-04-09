import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { HttpServiceMock } from '../../../../services/mocks/http-service.mock';
import { AsicsOtherApiService } from '@api/modules/asics';
import { AsicsHttpBaseApiServiceMock } from '../../services/mocks/http-base.service.mock';

describe('AsicsOtherApiService', () => {
  let service: AsicsOtherApiService;

  let getSpy: jest.SpyInstance;
  let buildUrlSpy: jest.SpyInstance;

  const { urlMock, responseDataMock } = HttpServiceMock;
  const { ipMock } = AsicsHttpBaseApiServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsOtherApiService,
        {
          provide: HttpService,
          useClass: HttpServiceMock,
        },
      ],
    }).compile();

    service = module.get(AsicsOtherApiService);

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

  describe('getStatus', () => {
    it('should return asic status', async () => {
      const result = await service.getStatus(ipMock);

      expect(buildUrlSpy).toHaveBeenCalledWith(ipMock, 'status');
      expect(getSpy).toHaveBeenCalledWith(urlMock);

      expect(result).toBe(responseDataMock);
    });
  });

  describe('getInfo', () => {
    it('should return asic info', async () => {
      const result = await service.getInfo(ipMock);

      expect(buildUrlSpy).toHaveBeenCalledWith(ipMock, 'info');
      expect(getSpy).toHaveBeenCalledWith(urlMock);

      expect(result).toBe(responseDataMock);
    });
  });

  describe('getSummary', () => {
    it('should return asic summary stats', async () => {
      const result = await service.getSummary(ipMock);

      expect(buildUrlSpy).toHaveBeenCalledWith(ipMock, 'summary');
      expect(getSpy).toHaveBeenCalledWith(urlMock);

      expect(result).toBe(responseDataMock);
    });
  });

  describe('getPerfSummary', () => {
    it('should return asic performance summary', async () => {
      const result = await service.getPerfSummary(ipMock);

      expect(buildUrlSpy).toHaveBeenCalledWith(ipMock, 'perf-summary');
      expect(getSpy).toHaveBeenCalledWith(urlMock);

      expect(result).toBe(responseDataMock);
    });
  });
});
