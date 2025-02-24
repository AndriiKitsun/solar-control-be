import { ClassMock } from '@common/types/test.types';
import { EspRelaysApiService, EspRelayStatus } from '@api/modules/esp';

export class EspRelaysApiServiceMock implements ClassMock<EspRelaysApiService> {
  static readonly relayStatusMock: EspRelayStatus = {
    status: true,
  };

  async getRelayStatus(): Promise<EspRelayStatus> {
    return EspRelaysApiServiceMock.relayStatusMock;
  }

  async updatePowerRelay(status: boolean): Promise<EspRelayStatus> {
    return EspRelaysApiServiceMock.relayStatusMock;
  }
}
