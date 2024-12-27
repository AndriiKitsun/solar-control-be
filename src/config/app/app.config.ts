import { registerAs } from '@nestjs/config';

export const APP_NAMESPACE = 'APP_NAMESPACE';

export interface AppConfigType {
  port: string;
  http: {
    timeout: number;
  };
}

export const AppConfig = registerAs<AppConfigType>(APP_NAMESPACE, () => {
  return {
    port: process.env.PORT ?? '3000',
    http: {
      timeout: parseInt(process.env.HTTP_TIMEOUT ?? '10000'),
    },
  } satisfies AppConfigType;
});
