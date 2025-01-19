import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { EspConfig, EspConfigType } from '@config/esp';
import { EspPzemCounter, EspRelayStatus } from './esp.types';
import { AxiosError } from 'axios';
import { HttpClientService } from '../../common';
import { HttpError } from 'src/common/interfaces';

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

  switchRelayStatus(status: boolean): Promise<EspRelayStatus> {
    const endpoint = status ? 'on' : 'off';
    const url = this.buildUrl('relays', endpoint);

    return this.post(url);
  }

  private buildUrl(...path: string[]): string {
    return new URL(path.join('/'), this.espConfig.endpoint).toString();
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
