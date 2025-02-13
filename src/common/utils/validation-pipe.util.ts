import {
  BadRequestException,
  ValidationError,
  HttpStatus,
} from '@nestjs/common';
import { NewValidationSubError, NewHttpError } from '../interfaces';
import { NewSystemName } from '../enums';
import { randomUUID } from 'node:crypto';

export function convertToHttpException(
  errors: ValidationError[],
): BadRequestException {
  const response: NewHttpError<NewValidationSubError> = {
    id: randomUUID(),
    errors: errors.map((error: ValidationError): NewValidationSubError => {
      const reason = error.value ? 'invalid' : 'missing';

      return {
        details: Object.entries(error.constraints ?? {}).map(
          ([key, value]) => ({
            key,
            value,
          }),
        ),
        message: `The '${error.property}' field is ${reason}`,
        property: error.property,
        reason,
        type: error.constructor.name,
      };
    }),
    system: NewSystemName.SERVER,
    status: HttpStatus.BAD_REQUEST,
    timestamp: new Date().toJSON(),
  };

  return new BadRequestException(response);
}
