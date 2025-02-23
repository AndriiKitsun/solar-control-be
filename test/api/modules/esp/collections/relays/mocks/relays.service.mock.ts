import { ClassMock } from '@common/types/test.types';
import { EspRelaysService, EspRelayStatus } from '@api/modules/esp';

export class EspRelaysServiceMock implements ClassMock<EspRelaysService> {
  static readonly relayStatus: EspRelayStatus = {
    status: true,
  };

  async getRelayStatus(): Promise<EspRelayStatus> {
    return EspRelaysServiceMock.relayStatus;
  }

  async updatePowerRelay(status: boolean): Promise<EspRelayStatus> {
    return EspRelaysServiceMock.relayStatus;
  }
}
