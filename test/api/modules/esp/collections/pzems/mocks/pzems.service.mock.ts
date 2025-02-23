import { ClassMock } from '@common/types/test.types';
import { EspPzemsService, EspPzemCounter } from '@api/modules/esp';

export class EspPzemsServiceMock implements ClassMock<EspPzemsService> {
  static readonly resetCounterResponseMock: EspPzemCounter[] = [
    {
      name: 'acInput',
      isReset: true,
    },
  ];

  async resetCounter(): Promise<EspPzemCounter[]> {
    return EspPzemsServiceMock.resetCounterResponseMock;
  }
}
