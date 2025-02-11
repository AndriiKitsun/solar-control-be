import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { convertToHttpException } from '@common/utils';
import { ClassConstructor } from 'class-transformer/types/interfaces';

export function validateEnv<T extends object>(cls: ClassConstructor<T>): T {
  const validatedConfig = plainToInstance(cls, process.env, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw convertToHttpException(errors);
  }

  return validatedConfig;
}
