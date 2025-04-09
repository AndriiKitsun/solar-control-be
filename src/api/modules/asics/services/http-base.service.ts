import { AbstractHttpService } from '../../../services';
import { AxiosError } from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ServerError, HttpSubError } from '@common/interfaces';
import { randomUUID } from 'node:crypto';
import { ErrorCode, SystemName } from '@common/enums';

export abstract class AsicsHttpBaseApiService extends AbstractHttpService {
  protected buildUrl(ip: string, path: string): string {
    return `http://${ip}/api/v1/${path}`;
  }

  protected didEncounterError(error: AxiosError): HttpException {
    const status = error.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string;

    if (!error.response?.data) {
      message = error.message;
    } else if (typeof error.response.data === 'string') {
      message = error.response.data;
    } else {
      message = JSON.stringify(error.response.data);
    }

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
      system: SystemName.ASIC,
      timestamp: new Date().toJSON(),
    };

    return new HttpException(response, status);
  }
}
