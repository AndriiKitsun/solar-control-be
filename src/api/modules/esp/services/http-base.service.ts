import { AxiosError } from 'axios';
import { HttpException, Inject } from '@nestjs/common';
import { ServerError, HttpSubError } from '@common/interfaces';
import { randomUUID } from 'node:crypto';
import { ErrorCode, SystemName } from '@common/enums';
import { EspConfigType, EspConfig } from '@config/esp.config';
import { AbstractHttpService } from '../../../services';

export abstract class EspHttpBaseService extends AbstractHttpService {
  @Inject(EspConfig.KEY)
  private espConfig!: EspConfigType;

  protected buildUrl(...path: string[]): string {
    return new URL(path.join('/'), this.espConfig.endpoint).toString();
  }

  protected didEncounterError(error: AxiosError): HttpException {
    const status = this.mapStatusCode(error.response?.status);
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
