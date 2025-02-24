import { ClassMock } from '@common/types/test.types';
import { RelaysService } from '@modules/relays/relays.service';
import { EspRelayStatus } from '@api/modules/esp';
import { EspRelaysServiceMock } from '@api/modules/esp/collections/relays/mocks/relays.service.mock';

export class RelaysServiceMock implements ClassMock<RelaysService> {
  async getRelayStatus(): Promise<EspRelayStatus> {
    return EspRelaysServiceMock.relayStatusMock;
  }

  async updatePowerRelay(status: boolean): Promise<EspRelayStatus> {
    return EspRelaysServiceMock.relayStatusMock;
  }
}
