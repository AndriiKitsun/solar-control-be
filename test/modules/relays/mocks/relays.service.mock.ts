import { ClassMock } from '@common/types/test.types';
import { RelaysService } from '@modules/relays/relays.service';
import { EspRelayStatus } from '@api/modules/esp';
import { EspRelaysApiServiceMock } from '@api/modules/esp/collections/relays/mocks/relays.service.mock';
import { LogType } from '@modules/logs/enums';

export class RelaysServiceMock implements ClassMock<RelaysService> {
  async getRelayStatus(): Promise<EspRelayStatus> {
    return EspRelaysApiServiceMock.relayStatusMock;
  }

  async updatePowerRelay(status: boolean): Promise<EspRelayStatus> {
    return EspRelaysApiServiceMock.relayStatusMock;
  }

  async switchPower(
    status: boolean,
    type: LogType,
  ): Promise<EspRelayStatus | void> {
    return;
  }
}
