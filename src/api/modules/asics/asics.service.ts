import { Injectable } from '@nestjs/common';
import { AsicLoginResponse, AsicLoginDto } from './asics.types';
import { HttpApiService } from '../../common';

@Injectable()
export class AsicsApiService {
  constructor(private readonly httpApiService: HttpApiService) {}

  async login(ip: string, password: string): Promise<AsicLoginResponse> {
    const url = this.buildUrl(ip, ['unlock']);
    const body: AsicLoginDto = {
      pw: password,
    };

    const str = JSON.stringify({
      ip,
      date: new Date().toJSON(),
    });

    return {
      token: Buffer.from(str).toString('base64'),
    };

    // TODO: Replace stub token with actual Asic API
    return this.httpApiService.post<AsicLoginResponse>(url, body);
  }

  async start(ip: string, token: string): Promise<void> {
    const url = this.buildUrl(ip, ['mining', 'start']);

    return this.httpApiService.post(url, null, {
      headers: {
        Authorization: token,
      },
    });
  }

  async stop(ip: string, token: string): Promise<void> {
    const url = this.buildUrl(ip, ['mining', 'stop']);

    return this.httpApiService.post(url, null, {
      headers: {
        Authorization: token,
      },
    });
  }

  private buildUrl(ip: string, path: string[]): string {
    return `http://${ip}/api/v1/${path.join('/')}`;
  }
}
