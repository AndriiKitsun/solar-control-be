import { EspApiService } from '@api/modules/esp/esp.service';
import { EspResetPzemCounterResponse } from '@api/modules/esp/esp.types';
import { ClassMock } from '@common/types/test.types';

export class EspApiServiceMock implements ClassMock<EspApiService> {
  static healthCheckResponseMock = 'UP';
  static counterResetResponseMock: EspResetPzemCounterResponse = {
    name: 'acInput',
    isReset: true,
  };

  checkHealth(): Promise<string> {
    return Promise.resolve('');
  }

  async resetCounter(): Promise<EspResetPzemCounterResponse> {
    return EspApiServiceMock.counterResetResponseMock;
  }
}
