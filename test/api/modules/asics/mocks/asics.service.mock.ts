import { AsicsApiService } from '@api/modules/asics/asics.service';
import { AsicInfo, AsicUnlockSuccess } from '@api/modules/asics/asics.types';
import { ClassMockWithout } from '@common/types/test.types';
import { HttpClientService } from '@api/common';

export class AsicsApiServiceMock
  implements ClassMockWithout<AsicsApiService, HttpClientService>
{
  static readonly loginResponseMock: AsicUnlockSuccess = {
    token: '123',
  };

  async login(ip: string, password: string): Promise<AsicUnlockSuccess> {
    return AsicsApiServiceMock.loginResponseMock;
  }

  async start(ip: string, token: string): Promise<void> {
    return;
  }

  async stop(ip: string, token: string): Promise<void> {
    return;
  }

  async getInfo(ip: string): Promise<AsicInfo> {
    return {
      hr_measure: 'MH/s',
      install_type: 'sd',
      platform: 'xil',
      build_time: '',
      fw_name: '',
      fw_version: '',
      miner: '',
      model: '',
      system: undefined,
    };
  }
}
