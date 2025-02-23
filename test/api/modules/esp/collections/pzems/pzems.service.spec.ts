import { Test } from '@nestjs/testing';
import { EspPzemsService } from '@api/modules/esp';
import { HttpService } from '@nestjs/axios';
import { EspConfig } from '@config/esp.config';
import { EspConfigMock } from '@config/mocks/esp.config.mock';
import { HttpServiceMock } from '../../../../services/mocks/http-service.mock';

describe('EspPzemsService', () => {
  let service: EspPzemsService;

  let buildUrlSpy: jest.SpyInstance;
  let deleteSpy: jest.SpyInstance;

  const { urlMock, responseDataMock } = HttpServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EspPzemsService,
        {
          provide: EspConfig.KEY,
          useValue: EspConfigMock,
        },
        {
          provide: HttpService,
          useValue: HttpServiceMock,
        },
      ],
    }).compile();

    service = module.get(EspPzemsService);

    buildUrlSpy = jest
      .spyOn(service as any, 'buildUrl')
      .mockReturnValue(urlMock);
    deleteSpy = jest
      .spyOn(service as any, 'delete')
      .mockResolvedValue(responseDataMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('resetCounter', () => {
    it('should make request to reset counter', async () => {
      const result = await service.resetCounter();

      expect(buildUrlSpy).toHaveBeenCalledWith('pzems', 'counter');
      expect(deleteSpy).toHaveBeenCalledWith(urlMock);

      expect(result).toBe(responseDataMock);
    });
  });
});
