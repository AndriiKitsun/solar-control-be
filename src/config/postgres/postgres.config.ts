import { registerAs } from '@nestjs/config';

const POSTGRES_NAMESPACE = 'POSTGRES_NAMESPACE';

export interface PostgresConfigType {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export const PostgresConfig = registerAs<PostgresConfigType>(
  POSTGRES_NAMESPACE,
  () => {
    return {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT ?? ''),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB_NAME,
    } as PostgresConfigType;
  },
);
