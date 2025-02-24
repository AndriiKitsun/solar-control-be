import { Test } from '@nestjs/testing';
import { RelaysService } from '@modules/relays/relays.service';
import { EspRelaysApiService } from '@api/modules/esp';
import { EspRelaysApiServiceMock } from '@api/modules/esp/collections/relays/mocks/relays.service.mock';

describe('RelaysService', () => {
  let service: RelaysService;
  let espRelaysApiService: EspRelaysApiService;

  const { relayStatusMock } = EspRelaysApiServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RelaysService,
        {
          provide: EspRelaysApiService,
          useClass: EspRelaysApiServiceMock,
        },
      ],
    }).compile();

    service = module.get(RelaysService);
    espRelaysApiService = module.get(EspRelaysApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRelayStatus', () => {
    it('should return relay power status', async () => {
      const getRelayStatusSpy = jest.spyOn(
        espRelaysApiService,
        'getRelayStatus',
      );

      const result = await service.getRelayStatus();

      expect(getRelayStatusSpy).toHaveBeenCalled();

      expect(result).toBe(relayStatusMock);
    });
  });

  describe('updatePowerRelay', () => {
    it('should return status of updating the power relay', async () => {
      const updatePowerRelaySpy = jest.spyOn(
        espRelaysApiService,
        'updatePowerRelay',
      );

      const result = await service.updatePowerRelay(false);

      expect(updatePowerRelaySpy).toHaveBeenCalledWith(false);

      expect(result).toBe(relayStatusMock);
    });
  });
});
