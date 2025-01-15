import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import {
  AsicUnlockScreenBody,
  AsicUnlockSuccess,
  AsicInfo,
} from './asics.types';
import { AxiosError } from 'axios';
import { HttpClientService } from '../../common';
import { HttpError } from '@common/interfaces';

@Injectable()
export class AsicsApiService extends HttpClientService {
  login(ip: string, password: string): Promise<AsicUnlockSuccess> {
    const url = this.buildUrl(ip, ['unlock']);
    const body: AsicUnlockScreenBody = {
      pw: password,
    };

    return this.post<AsicUnlockSuccess>(url, body);
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

  getInfo(ip: string): Promise<AsicInfo> {
    const url = this.buildUrl(ip, ['info']);

    return this.get(url);
  }

  private buildUrl(ip: string, path: string[]): string {
    return `http://${ip}/api/v1/${path.join('/')}`;
  }

  didEncounterError(error: AxiosError): any {
    const response: HttpError = {
      timestamp: new Date().toJSON(),
      code: error.code,
    };

    const status = error.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;

    if (!error.response?.data) {
      response.message = error.message;

      return new HttpException(response, status);
    }

    response.message =
      typeof error.response.data === 'string'
        ? error.response.data
        : JSON.stringify(error.response.data);

    return new HttpException(response, status);
  }
}
