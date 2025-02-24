import { Test } from '@nestjs/testing';
import { RelaysService } from '@modules/relays/relays.service';
import { EspRelaysService } from '@api/modules/esp';
import { EspRelaysServiceMock } from '@api/modules/esp/collections/relays/mocks/relays.service.mock';

describe('RelaysService', () => {
  let service: RelaysService;
  let espRelaysService: EspRelaysService;

  const { relayStatusMock } = EspRelaysServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RelaysService,
        {
          provide: EspRelaysService,
          useClass: EspRelaysServiceMock,
        },
      ],
    }).compile();

    service = module.get(RelaysService);
    espRelaysService = module.get(EspRelaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRelayStatus', () => {
    it('should return relay power status', async () => {
      const getRelayStatusSpy = jest.spyOn(espRelaysService, 'getRelayStatus');

      const result = await service.getRelayStatus();

      expect(getRelayStatusSpy).toHaveBeenCalled();

      expect(result).toBe(relayStatusMock);
    });
  });

  describe('updatePowerRelay', () => {
    it('should return status of updating the power relay', async () => {
      const updatePowerRelaySpy = jest.spyOn(
        espRelaysService,
        'updatePowerRelay',
      );

      const result = await service.updatePowerRelay(false);

      expect(updatePowerRelaySpy).toHaveBeenCalledWith(false);

      expect(result).toBe(relayStatusMock);
    });
  });
});
