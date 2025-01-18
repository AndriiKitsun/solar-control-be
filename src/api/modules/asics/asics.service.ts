import { Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import {
  AsicUnlockScreenBody,
  AsicUnlockSuccess,
  AsicInfo,
  AsicSummaryStats,
  AsicSummary,
  AsicPerfSummary,
} from './asics.types';
import { AxiosError } from 'axios';
import { HttpClientService } from '../../common';
import { HttpError } from '@common/interfaces';
import { Maybe } from '@common/types';

@Injectable()
export class AsicsApiService extends HttpClientService {
  private logger = new Logger(AsicsApiService.name);

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

  async getSummary(ip: string): Promise<Maybe<AsicSummary>> {
    const url = this.buildUrl(ip, ['summary']);
    const response = await this.get<AsicSummaryStats>(url);

    return response.miner;
  }

  async getPerfSummary(ip: string): Promise<Maybe<AsicPerfSummary>> {
    const url = this.buildUrl(ip, ['perf-summary']);

    // GET /perf-summary doesn't exist in v1.2.1, so handle 404 here
    try {
      return await this.get<AsicPerfSummary>(url);
    } catch (err) {
      this.logger.error(err);
      return null;
    }
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
