import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { TypeORMError } from 'typeorm';
import { FastifyReply } from 'fastify';
import { ServerError } from '../interfaces';
import { randomUUID } from 'node:crypto';
import { SystemName } from '../enums';
import { TYPEORM_ERROR_STATUS } from '../constants';

@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter<TypeORMError> {
  catch(exception: TypeORMError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const status =
      TYPEORM_ERROR_STATUS[exception.name] ?? HttpStatus.INTERNAL_SERVER_ERROR;

    const error: ServerError = {
      id: randomUUID(),
      errors: [
        {
          message: exception.message,
          type: exception.name,
        },
      ],
      status,
      system: SystemName.DATABASE,
      timestamp: new Date().toJSON(),
    };

    response.status(status).send(error);
  }
}
