import { EspRelayStatus } from '@api/modules';
import { ClassMock } from '@common/types/test.types';
import { EspApiServiceMock } from '@api/modules/esp/mocks/esp-service.mock';
import { RelaysService } from '@models/relays/relays.service';

export class RelaysServiceMock implements ClassMock<RelaysService> {
  async getRelayStatus(): Promise<EspRelayStatus> {
    return EspApiServiceMock.relayStatus;
  }

  async updatePowerRelay(status: boolean): Promise<EspRelayStatus> {
    return EspApiServiceMock.relayStatus;
  }
}
