import { Injectable } from '@nestjs/common';
import { AsicPreset } from './autotune.types';
import { AsicsHttpBaseApiService } from '../../services/http-base.service';

@Injectable()
export class AsicsAutotuneApiService extends AsicsHttpBaseApiService {
  getPresets(ip: string, token: string): Promise<AsicPreset[]> {
    const url = this.buildUrl(ip, 'autotune/presets');

    return this.get(url, {
      headers: {
        Authorization: token,
      },
    });
  }
}
