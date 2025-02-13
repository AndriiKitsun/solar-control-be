import { HttpStatus } from '@nestjs/common';

export const TYPEORM_ERROR_STATUS: Record<string, HttpStatus> = {
  EntityNotFoundError: HttpStatus.NOT_FOUND,
};
