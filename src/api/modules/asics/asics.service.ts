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
import { NewHttpError, NewHttpSubError } from '@common/interfaces';
import { Maybe } from '@common/types';
import { randomUUID } from 'node:crypto';
import { NewSystemName, ErrorCode } from '@common/enums';
import {
  HttpErrorByCode,
  ErrorHttpStatusCode,
} from '@nestjs/common/utils/http-error-by-code.util';

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
    const status: ErrorHttpStatusCode =
      error.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;

    if (!error.response?.data) {
      message = error.message;
    } else if (typeof error.response.data === 'string') {
      message = error.response.data;
    } else {
      message = JSON.stringify(error.response.data);
    }

    const response: NewHttpError<NewHttpSubError> = {
      id: randomUUID(),
      errors: [
        {
          code: error.code ?? ErrorCode.HTTP_UNKNOWN,
          message,
          type: HttpErrorByCode[status].name,
        },
      ],
      status,
      system: NewSystemName.ASIC,
      timestamp: new Date().toJSON(),
    };

    return new HttpException(response, status);
  }
}
