import { ClassMock } from '@common/types/test.types';
import { EspPzemsApiService, EspPzemCounter } from '@api/modules/esp';

export class EspPzemsApiServiceMock implements ClassMock<EspPzemsApiService> {
  static readonly resetCounterResponseMock: EspPzemCounter[] = [
    {
      name: 'acInput',
      isReset: true,
    },
  ];

  async resetCounter(): Promise<EspPzemCounter[]> {
    return EspPzemsApiServiceMock.resetCounterResponseMock;
  }
}
