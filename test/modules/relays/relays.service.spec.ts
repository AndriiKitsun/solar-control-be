import { Test, TestingModule } from '@nestjs/testing';
import { EspApiService } from '@api/modules';
import { EspApiServiceMock } from '@api/modules/esp/mocks/esp-service.mock';
import { RelaysService } from '../../../src/modules/relays/relays.service';

describe('RelaysService', () => {
  let service: RelaysService;
  let espApiService: EspApiService;

  const { relayStatus } = EspApiServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelaysService,
        {
          provide: EspApiService,
          useClass: EspApiServiceMock,
        },
      ],
    }).compile();

    service = module.get(RelaysService);
    espApiService = module.get(EspApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRelayStatus', () => {
    it('should return relay power status', async () => {
      const getRelayStatusSpy = jest.spyOn(espApiService, 'getRelayStatus');

      const result = await service.getRelayStatus();

      expect(getRelayStatusSpy).toHaveBeenCalled();

      expect(result).toBe(relayStatus);
    });
  });

  describe('updatePowerRelay', () => {
    it('should return status of updating the power relay', async () => {
      const updatePowerRelaySpy = jest.spyOn(espApiService, 'updatePowerRelay');

      const result = await service.updatePowerRelay(false);

      expect(updatePowerRelaySpy).toHaveBeenCalledWith(false);

      expect(result).toBe(relayStatus);
    });
  });
});
