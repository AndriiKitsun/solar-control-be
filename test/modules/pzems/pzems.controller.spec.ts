import { Test, TestingModule } from '@nestjs/testing';
import { PzemsController, PzemsService } from '../../../src/modules/pzems';
import { PzemsServiceMock } from './services/mocks/pzems.service.mock';
import { EspApiServiceMock } from '@api/modules/esp/mocks/esp-service.mock';

describe('PzemsController', () => {
  let controller: PzemsController;
  let pzemsService: PzemsService;

  const { counterResetResponseMock } = EspApiServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

      expect(result).toBe(counterResetResponseMock);
    });
  });
});
