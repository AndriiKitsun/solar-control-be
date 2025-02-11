import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString, IsNumber, Min, Max } from 'class-validator';
import { validateEnv } from '@common/validators';

const POSTGRES_NAMESPACE = 'POSTGRES_NAMESPACE';

export interface PostgresConfigType {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

class PostgresEnvVariables {
  @IsString()
  @IsNotEmpty()
  POSTGRES_HOST!: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  @IsNotEmpty()
  POSTGRES_PORT!: number;

  @IsString()
  @IsNotEmpty()
  POSTGRES_USERNAME!: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  POSTGRES_DB_NAME!: string;
}

export const PostgresConfig = registerAs<PostgresConfigType>(
  POSTGRES_NAMESPACE,
  (): PostgresConfigType => {
    const config = validateEnv(PostgresEnvVariables);

    return {
      host: config.POSTGRES_HOST,
      port: config.POSTGRES_PORT,
      username: config.POSTGRES_USERNAME,
      password: config.POSTGRES_PASSWORD,
      database: config.POSTGRES_DB_NAME,
    };
  },
);
