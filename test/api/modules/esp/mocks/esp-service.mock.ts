import { EspApiService } from '@api/modules/esp/esp.service';
import { EspPzemCounter } from '@api/modules/esp/esp.types';
import { ClassMock } from '@common/types/test.types';

export class EspApiServiceMock implements ClassMock<EspApiService> {
  static readonly healthCheckResponseMock = 'UP';
  static readonly counterResetResponseMock: EspPzemCounter = {
    name: 'acInput',
    isReset: true,
  };

  checkHealth(): Promise<string> {
    return Promise.resolve('');
  }

  async resetCounter(): Promise<EspPzemCounter> {
    return EspApiServiceMock.counterResetResponseMock;
  }
}
