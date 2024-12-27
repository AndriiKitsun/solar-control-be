import { BadRequestException, ValidationError } from '@nestjs/common';
import { HttpSubError, HttpError, HttpErrorType } from '../../types';
import { AxiosError } from 'axios';

export function convertToHttpException(
  errors: ValidationError[],
): BadRequestException {
  const response: HttpError = {
    timestamp: new Date().toJSON(),
    code: AxiosError.ERR_BAD_REQUEST,
    errors: errors
      .map((error) => {
        const constraints = Object.values(error.constraints ?? {});

        return constraints.map((message) => {
          return {
            type: HttpErrorType.VALIDATION,
            message,
            reason: error.value ? 'invalid' : 'missing',
            details: [{ key: 'subject', value: error.property }],
          } satisfies HttpSubError;
        });
      })
      .flat(),
  };

  return new BadRequestException(response);
}
