import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { TypeORMError } from 'typeorm';
import { FastifyReply } from 'fastify';
import { NewHttpError } from '../interfaces';
import { randomUUID } from 'node:crypto';
import { NewSystemName } from '../enums';

@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter<TypeORMError> {
  catch(exception: TypeORMError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    const error: NewHttpError = {
      id: randomUUID(),
      errors: [
        {
          message: exception.message,
          type: exception.name,
        },
      ],
      status: this.resolveStatusCode(exception),
      system: NewSystemName.DATABASE,
      timestamp: new Date().toJSON(),
    };

    response.status(error.status).send(error);
  }

  private resolveStatusCode(exception: TypeORMError): HttpStatus {
    if (exception.name === 'EntityNotFoundError') {
      return HttpStatus.NOT_FOUND;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
