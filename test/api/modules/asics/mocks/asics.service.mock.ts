import { AsicsApiService } from '@api/modules/asics/asics.service';
import { AsicLoginResponse } from '@api/modules/asics/asics.types';
import { ClassMock } from '@common/types/test.types';

export class AsicsApiServiceMock implements ClassMock<AsicsApiService> {
  static readonly loginResponseMock: AsicLoginResponse = {
    token: '123',
  };

  async login(ip: string, password: string): Promise<AsicLoginResponse> {
    return AsicsApiServiceMock.loginResponseMock;
  }

  async start(ip: string, token: string): Promise<void> {
    return;
  }

  async stop(ip: string, token: string): Promise<void> {
    return;
  }
}
