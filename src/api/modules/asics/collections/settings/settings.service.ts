import { Injectable } from '@nestjs/common';
import {
  AsicsSettings,
  AsicSetting,
  AsicSettingSaveResult,
} from './settings.types';
import { AsicsHttpBaseApiService } from '../../services/http-base.service';

@Injectable()
export class AsicsSettingsApiService extends AsicsHttpBaseApiService {
  getSettings(ip: string, token: string): Promise<AsicsSettings> {
    const url = this.buildUrl(ip, 'settings');

    return this.get(url, {
      headers: {
        Authorization: token,
      },
    });
  }

  saveSettings(
    ip: string,
    token: string,
    setting: AsicSetting,
  ): Promise<AsicSettingSaveResult> {
    const url = this.buildUrl(ip, 'settings');

    return this.post(url, setting, {
      headers: {
        Authorization: token,
      },
    });
  }
}
