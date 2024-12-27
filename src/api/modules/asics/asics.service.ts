import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AsicLoginResponse } from './asics.types';
import { HttpClientService, HttpError } from '../../common';
import { AxiosError } from 'axios';

@Injectable()
export class AsicsApiService extends HttpClientService {
  constructor() {
    super();
  }

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

  didEncounterError(error: AxiosError): HttpException {
    let status: HttpStatus;

    if (error.response?.status) {
      status = error.response.status;
    } else if (error.code === 'ECONNABORTED' || error.code === 'EHOSTDOWN') {
      status = HttpStatus.GATEWAY_TIMEOUT;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const message =
      typeof error.response?.data === 'string'
        ? error.response.data
        : error.message;

    const response: HttpError = {
      timestamp: new Date().toJSON(),
      code: error.code,
      message,
    };

    return new HttpException(response, status);
  }
}
