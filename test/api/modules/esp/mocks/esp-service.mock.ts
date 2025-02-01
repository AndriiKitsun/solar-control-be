import { EspApiService } from '@api/modules/esp/esp.service';
import { EspPzemCounter, EspRelayStatus } from '@api/modules/esp/esp.types';
import { ClassMockWithout } from '@common/types/test.types';
import { HttpClientService } from '@api/common';

export class EspApiServiceMock
  implements ClassMockWithout<EspApiService, HttpClientService>
{
  static readonly counterResetResponseMock: EspPzemCounter[] = [
    {
      name: 'acInput',
      isReset: true,
    },
  ];

  static readonly relayStatus: EspRelayStatus = {
    status: true,
  };

  async resetCounter(): Promise<EspPzemCounter[]> {
    return EspApiServiceMock.counterResetResponseMock;
  }

  async getRelayStatus(): Promise<EspRelayStatus> {
    return EspApiServiceMock.relayStatus;
  }

  async updatePowerRelay(status: boolean): Promise<EspRelayStatus> {
    return EspApiServiceMock.relayStatus;
  }
}
