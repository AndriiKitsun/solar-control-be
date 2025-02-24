import { ClassMock } from '@common/types/test.types';
import { EspRelaysService, EspRelayStatus } from '@api/modules/esp';

export class EspRelaysServiceMock implements ClassMock<EspRelaysService> {
  static readonly relayStatusMock: EspRelayStatus = {
    status: true,
  };

  async getRelayStatus(): Promise<EspRelayStatus> {
    return EspRelaysServiceMock.relayStatusMock;
  }

  async updatePowerRelay(status: boolean): Promise<EspRelayStatus> {
    return EspRelaysServiceMock.relayStatusMock;
  }
}
