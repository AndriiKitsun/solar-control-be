import { AsicsApiService } from '@api/modules/asics/asics.service';
import { AsicLoginResponse } from '@api/modules/asics/asics.types';
import { ClassMockWithout } from '@common/types/test.types';
import { HttpClientService } from '@api/common';

export class AsicsApiServiceMock
  implements ClassMockWithout<AsicsApiService, HttpClientService>
{
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
