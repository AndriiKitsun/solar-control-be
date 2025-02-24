import { Test } from '@nestjs/testing';
import { RelaysServiceMock } from './mocks/relays.service.mock';
import { RelaysController } from '@modules/relays/relays.controller';
import { RelaysService } from '@modules/relays/relays.service';
import { EspRelaysApiServiceMock } from '@api/modules/esp/collections/relays/mocks/relays.service.mock';

describe('RelaysController', () => {
  let controller: RelaysController;
  let relaysService: RelaysService;

  const { relayStatusMock } = EspRelaysApiServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
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

      expect(result).toBe(relayStatusMock);
    });
  });

  describe('updatePowerRelay', () => {
    it('should return status of updating the power', async () => {
      const updatePowerRelaySpy = jest.spyOn(relaysService, 'updatePowerRelay');

      const result = await controller.updatePowerRelay({
        status: false,
      });

      expect(updatePowerRelaySpy).toHaveBeenCalledWith(false);

      expect(result).toBe(relayStatusMock);
    });
  });
});
