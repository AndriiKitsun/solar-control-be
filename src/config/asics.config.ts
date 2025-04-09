import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { validateEnv } from '@common/validators';

const ASICS_NAMESPACE = 'ASICS_NAMESPACE';

export interface AsicsConfigType {
  httpTimeout: number;
}

class AsicsEnvVariables {
  @IsNumber()
  @IsNotEmpty()
  ASICS_HTTP_TIMEOUT!: number;
}

export const AsicsConfig = registerAs<AsicsConfigType>(
  ASICS_NAMESPACE,
  (): AsicsConfigType => {
    const config = validateEnv(AsicsEnvVariables);

    return {
      httpTimeout: config.ASICS_HTTP_TIMEOUT,
    };
  },
);
