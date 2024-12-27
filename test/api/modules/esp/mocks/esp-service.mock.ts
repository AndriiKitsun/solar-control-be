import { EspApiService } from '@api/modules/esp/esp.service';
import { EspPzemCounter } from '@api/modules/esp/esp.types';
import { ClassMockWithout } from '@common/types/test.types';
import { HttpClientService } from '@api/common';

export class EspApiServiceMock
  implements ClassMockWithout<EspApiService, HttpClientService>
{
  static readonly healthCheckResponseMock = 'UP';
  static readonly counterResetResponseMock: EspPzemCounter[] = [
    {
      name: 'acInput',
      isReset: true,
    },
  ];

  checkHealth(): Promise<string> {
    return Promise.resolve('');
  }

  async resetCounter(): Promise<EspPzemCounter[]> {
    return EspApiServiceMock.counterResetResponseMock;
  }
}
