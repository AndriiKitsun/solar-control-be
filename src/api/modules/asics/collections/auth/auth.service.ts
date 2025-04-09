import { AsicUnlockScreenBody, AsicUnlockSuccess } from './auth.types';
import { Injectable } from '@nestjs/common';
import { AsicsHttpBaseApiService } from '../../services/http-base.service';

@Injectable()
export class AsicsAuthApiService extends AsicsHttpBaseApiService {
  login(ip: string, password: string): Promise<AsicUnlockSuccess> {
    const url = this.buildUrl(ip, 'unlock');
    const body: AsicUnlockScreenBody = { pw: password };

    return this.post(url, body);
  }
}
