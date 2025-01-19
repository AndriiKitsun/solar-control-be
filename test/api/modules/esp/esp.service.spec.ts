import { Test, TestingModule } from '@nestjs/testing';
import { EspApiService } from '@api/modules';
import { EspConfig } from '@config/esp';
import { EspConfigMock } from '@config/esp/mocks/esp.config.mock';
import { HttpService } from '@nestjs/axios';
import { HttpServiceMock } from '../../common/services/mocks/http-service.mock';

describe('EspApiService', () => {
  let service: EspApiService;

  let buildUrlSpy: jest.SpyInstance;
  let deleteSpy: jest.SpyInstance;
  let getSpy: jest.SpyInstance;
  let postSpy: jest.SpyInstance;

  const { urlMock, responseDataMock } = HttpServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EspApiService,
        {
          provide: EspConfig.KEY,
          useValue: EspConfigMock,
        },
        {
          provide: HttpService,
          useClass: HttpServiceMock,
        },
      ],
    }).compile();

    service = module.get(EspApiService);

    buildUrlSpy = jest
      .spyOn(service as any, 'buildUrl')
      .mockReturnValue(urlMock);
    deleteSpy = jest
      .spyOn(service, 'delete')
      .mockResolvedValue(responseDataMock);
    getSpy = jest.spyOn(service, 'get').mockResolvedValue(responseDataMock);
    postSpy = jest.spyOn(service, 'post').mockResolvedValue(responseDataMock);
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

  describe('getRelayStatus', () => {
    it('should make request to get relay status', async () => {
      const result = await service.getRelayStatus();

      expect(buildUrlSpy).toHaveBeenCalledWith('relays');
      expect(getSpy).toHaveBeenCalledWith(urlMock);

      expect(result).toBe(responseDataMock);
    });
  });

  describe('switchRelayStatus', () => {
    it('should make request to turn relay on', async () => {
      const result = await service.switchRelayStatus(true);

      expect(buildUrlSpy).toHaveBeenCalledWith('relays', 'on');
      expect(postSpy).toHaveBeenCalledWith(urlMock);

      expect(result).toBe(responseDataMock);
    });

    it('should make request to turn relay off', async () => {
      const result = await service.switchRelayStatus(false);

      expect(buildUrlSpy).toHaveBeenCalledWith('relays', 'off');
      expect(postSpy).toHaveBeenCalledWith(urlMock);

      expect(result).toBe(responseDataMock);
    });
  });
});
