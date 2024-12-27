import { Injectable } from '@nestjs/common';
import { AsicLoginResponse } from './asics.types';
import { HttpClientService } from '../../common/modules';

@Injectable()
export class AsicsApiService {
  constructor(private readonly httpClientService: HttpClientService) {}

  login(ip: string, password: string): Promise<AsicLoginResponse> {
    const str = JSON.stringify({
      ip,
      date: new Date().toJSON(),
      password,
    });

    return Promise.resolve({
      token: Buffer.from(str).toString('base64'),
    });

    // const url = this.buildUrl(ip, ['unlock']);
    // const body: AsicLoginDto = {
    //   pw: password,
    // };
    //
    //
    // return this.httpClientService.post<AsicLoginResponse>(url, body);
  }

  async start(ip: string, token: string): Promise<void> {
    const url = this.buildUrl(ip, ['mining', 'start']);

    return this.httpClientService.post(url, null, {
      headers: {
        Authorization: token,
      },
    });
  }

  async stop(ip: string, token: string): Promise<void> {
    const url = this.buildUrl(ip, ['mining', 'stop']);

    return this.httpClientService.post(url, null, {
      headers: {
        Authorization: token,
      },
    });
  }

  private buildUrl(ip: string, path: string[]): string {
    return `http://${ip}/api/v1/${path.join('/')}`;
  }
}
