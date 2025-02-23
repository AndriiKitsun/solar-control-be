import { Test } from '@nestjs/testing';
import { EspRelaysService } from '@api/modules/esp';
import { HttpService } from '@nestjs/axios';
import { EspConfig } from '@config/esp.config';
import { EspConfigMock } from '@config/mocks/esp.config.mock';
import { HttpServiceMock } from '../../../../services/mocks/http-service.mock';

describe('EspRelaysService', () => {
  let service: EspRelaysService;

  let buildUrlSpy: jest.SpyInstance;
  let getSpy: jest.SpyInstance;
  let postSpy: jest.SpyInstance;

  const { urlMock, responseDataMock } = HttpServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EspRelaysService,
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

    service = module.get(EspRelaysService);

    buildUrlSpy = jest
      .spyOn(service as any, 'buildUrl')
      .mockReturnValue(urlMock);
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

  describe('getRelayStatus', () => {
    it('should make request to get relay status', async () => {
      const result = await service.getRelayStatus();

      expect(buildUrlSpy).toHaveBeenCalledWith('relays');
      expect(getSpy).toHaveBeenCalledWith(urlMock);

      expect(result).toBe(responseDataMock);
    });
  });

  describe('updatePowerRelay', () => {
    it('should make request to turn relay on', async () => {
      const result = await service.updatePowerRelay(true);

      expect(buildUrlSpy).toHaveBeenCalledWith('relays', 'on');
      expect(postSpy).toHaveBeenCalledWith(urlMock);

      expect(result).toBe(responseDataMock);
    });

    it('should make request to turn relay off', async () => {
      const result = await service.updatePowerRelay(false);

      expect(buildUrlSpy).toHaveBeenCalledWith('relays', 'off');
      expect(postSpy).toHaveBeenCalledWith(urlMock);

      expect(result).toBe(responseDataMock);
    });
  });
});
