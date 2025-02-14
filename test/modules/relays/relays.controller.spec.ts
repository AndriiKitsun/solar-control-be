import { Test, TestingModule } from '@nestjs/testing';
import { RelaysServiceMock } from './mocks/relays.service.mock';
import { EspApiServiceMock } from '@api/modules/esp/mocks/esp-service.mock';
import { RelaysController } from '@modules/relays/relays.controller';
import { RelaysService } from '@modules/relays/relays.service';

describe('RelaysController', () => {
  let controller: RelaysController;
  let relaysService: RelaysService;

  const { relayStatus } = EspApiServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelaysController,
        {
          provide: RelaysService,
          useClass: RelaysServiceMock,
        },
      ],
    }).compile();

    controller = module.get(RelaysController);
    relaysService = module.get(RelaysService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRelayStatus', () => {
    it('should return relay power status', async () => {
      const getRelayStatusSpy = jest.spyOn(relaysService, 'getRelayStatus');

      const result = await controller.getRelayStatus();

      expect(getRelayStatusSpy).toHaveBeenCalled();

      expect(result).toBe(relayStatus);
    });
  });

  describe('updatePowerRelay', () => {
    it('should return status of updating the power', async () => {
      const updatePowerRelaySpy = jest.spyOn(relaysService, 'updatePowerRelay');

      const result = await controller.updatePowerRelay({
        status: false,
      });

      expect(updatePowerRelaySpy).toHaveBeenCalledWith(false);

      expect(result).toBe(relayStatus);
    });
  });
});
