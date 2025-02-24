import { Test } from '@nestjs/testing';
import { PzemsService } from '@modules/pzems';
import { EspPzemsApiService } from '@api/modules/esp';
import { EspPzemsApiServiceMock } from '@api/modules/esp/collections/pzems/mocks/pzems.service.mock';

describe('PzemsService', () => {
  let service: PzemsService;
  let espPzemsApiService: EspPzemsApiService;

  const { resetCounterResponseMock } = EspPzemsApiServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PzemsService,
        {
          provide: EspPzemsApiService,
          useClass: EspPzemsApiServiceMock,
        },
      ],
    }).compile();

    service = module.get(PzemsService);
    espPzemsApiService = module.get(EspPzemsApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('resetEnergyCounter', () => {
    it('should return reset response', async () => {
      const resetCounterSpy = jest.spyOn(espPzemsApiService, 'resetCounter');

      const result = await service.resetEnergyCounter();

      expect(resetCounterSpy).toHaveBeenCalled();

      expect(result).toBe(resetCounterResponseMock);
    });
  });
});
