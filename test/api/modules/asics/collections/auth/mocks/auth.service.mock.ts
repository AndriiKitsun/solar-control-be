import { ClassMock } from '@common/types/test.types';
import { AsicsAuthApiService, AsicUnlockSuccess } from '@api/modules/asics';

export class AsicsAuthApiServiceMock implements ClassMock<AsicsAuthApiService> {
  static readonly tokenMock = 'token';
  static readonly loginResponseMock: AsicUnlockSuccess = {
    token: this.tokenMock,
  };

  static readonly passwordMock = 'password';

  async login(ip: string, password: string): Promise<AsicUnlockSuccess> {
    return AsicsAuthApiServiceMock.loginResponseMock;
  }
}
