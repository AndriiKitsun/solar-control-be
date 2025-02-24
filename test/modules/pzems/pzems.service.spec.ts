import { Test } from '@nestjs/testing';
import { PzemsService } from '@modules/pzems';
import { EspPzemsService } from '@api/modules/esp';
import { EspPzemsServiceMock } from '@api/modules/esp/collections/pzems/mocks/pzems.service.mock';

describe('PzemsService', () => {
  let service: PzemsService;
  let espPzemsService: EspPzemsService;

  const { resetCounterResponseMock } = EspPzemsServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PzemsService,
        {
          provide: EspPzemsService,
          useClass: EspPzemsServiceMock,
        },
      ],
    }).compile();

    service = module.get(PzemsService);
    espPzemsService = module.get(EspPzemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('resetEnergyCounter', () => {
    it('should return reset response', async () => {
      const resetCounterSpy = jest.spyOn(espPzemsService, 'resetCounter');

      const result = await service.resetEnergyCounter();

      expect(resetCounterSpy).toHaveBeenCalled();

      expect(result).toBe(resetCounterResponseMock);
    });
  });
});
