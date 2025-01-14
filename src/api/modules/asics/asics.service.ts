import { Injectable } from '@nestjs/common';
import { AsicLoginResponse, AsicLoginDto } from './asics.types';
import { AxiosError } from 'axios';
import { HttpClientService } from '../../common';

@Injectable()
export class AsicsApiService extends HttpClientService {
  login(ip: string, password: string): Promise<AsicLoginResponse> {
    const url = this.buildUrl(ip, ['unlock']);
    const body: AsicLoginDto = {
      pw: password,
    };

    return this.post<AsicLoginResponse>(url, body);
  }

  async start(ip: string, token: string): Promise<void> {
    const url = this.buildUrl(ip, ['mining', 'start']);

    return this.post(url, null, {
      headers: {
        Authorization: token,
      },
    });
  }

  async stop(ip: string, token: string): Promise<void> {
    const url = this.buildUrl(ip, ['mining', 'stop']);

    return this.post(url, null, {
      headers: {
        Authorization: token,
      },
    });
  }

  private buildUrl(ip: string, path: string[]): string {
    return `http://${ip}/api/v1/${path.join('/')}`;
  }

  didEncounterError(error: AxiosError): any {
    return error;
  }
}
