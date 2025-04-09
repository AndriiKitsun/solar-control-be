import { ClassMock } from '@common/types/test.types';
import { AsicsMiningApiService } from '@api/modules/asics';

export class AsicsMiningApiServiceMock
  implements ClassMock<AsicsMiningApiService>
{
  async start(ip: string, token: string): Promise<void> {
    return;
  }

  async stop(ip: string, token: string): Promise<void> {
    return;
  }
}
