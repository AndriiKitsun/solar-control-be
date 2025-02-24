import { Test } from '@nestjs/testing';
import { PzemsController, PzemsService } from '@modules/pzems';
import { EspPzemsApiServiceMock } from '@api/modules/esp/collections/pzems/mocks/pzems.service.mock';
import { PzemsServiceMock } from './mocks/pzems.service.mock';

describe('PzemsController', () => {
  let controller: PzemsController;
  let pzemsService: PzemsService;

  const { resetCounterResponseMock } = EspPzemsApiServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PzemsController,
        {
          provide: PzemsService,
          useClass: PzemsServiceMock,
        },
      ],
    }).compile();

    controller = module.get(PzemsController);
    pzemsService = module.get(PzemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('resetEnergyCounter', () => {
    it('should return reset response', async () => {
      const resetEnergyCounterSpy = jest.spyOn(
        pzemsService,
        'resetEnergyCounter',
      );

      const result = await controller.resetEnergyCounter();

      expect(resetEnergyCounterSpy).toHaveBeenCalled();

      expect(result).toBe(resetCounterResponseMock);
    });
  });
});
