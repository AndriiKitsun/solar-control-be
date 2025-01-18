import { registerAs } from '@nestjs/config';
import { initCrypto } from '@common/utils';

export const APP_NAMESPACE = 'APP_NAMESPACE';

export interface AppConfigType {
  port: string;
  http: {
    timeout: number;
  };
  feature: {
    clearPzems: boolean;
  };
}

export const AppConfig = registerAs<AppConfigType>(APP_NAMESPACE, () => {
  initCrypto();

  return {
    port: process.env.PORT ?? '3000',
    http: {
      timeout: parseInt(process.env.HTTP_TIMEOUT ?? '10000'),
    },
    feature: {
      clearPzems: process.env.CLEAR_PZEMS_ON_START === 'true',
    },
  } satisfies AppConfigType;
});
