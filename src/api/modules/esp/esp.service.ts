import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { EspConfigType, EspConfig } from '@config/esp.config';
import { EspPzemCounter, EspRelayStatus } from './esp.types';
import { AxiosError } from 'axios';
import { HttpClientService } from '../../common';
import { ServerError, HttpSubError } from 'src/common/interfaces';
import { SystemName, ErrorCode } from '@common/enums';
import { randomUUID } from 'node:crypto';

@Injectable()
export class EspApiService extends HttpClientService {
  constructor(
    @Inject(EspConfig.KEY)
    private readonly espConfig: EspConfigType,
  ) {
    super();
  }

  resetCounter(): Promise<EspPzemCounter[]> {
    const url = this.buildUrl('pzems', 'counter');

    return this.delete(url);
  }

  getRelayStatus(): Promise<EspRelayStatus> {
    const url = this.buildUrl('relays');

    return this.get(url);
  }

  updatePowerRelay(status: boolean): Promise<EspRelayStatus> {
    const endpoint = status ? 'on' : 'off';
    const url = this.buildUrl('relays', endpoint);

    return this.post(url);
  }

  private buildUrl(...path: string[]): string {
    return new URL(path.join('/'), this.espConfig.endpoint).toString();
  }

  didEncounterError(error: AxiosError): HttpException {
    const status = error.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      typeof error.response?.data === 'string'
        ? error.response.data
        : error.message;

    const response: ServerError<HttpSubError> = {
      id: randomUUID(),
      errors: [
        {
          code: error.code ?? ErrorCode.HTTP_UNKNOWN,
          message,
          type: error.constructor.name,
        },
      ],
      status,
      system: SystemName.ESP,
      timestamp: new Date().toJSON(),
    };

    return new HttpException(response, status);
  }
}
