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
    pzemCalcPeriod: number;
  };
}

export const AppConfig = registerAs<AppConfigType>(APP_NAMESPACE, () => {
  initCrypto();

  return {
    port: process.env.PORT ?? '3000',
    http: {
      timeout: parseInt(process.env.HTTP_TIMEOUT!) || 10_000,
    },
    feature: {
      clearPzems: process.env.PZEMS_CLEAR_ON_START === 'true',
      pzemCalcPeriod: parseFloat(process.env.PZEMS_PERIOD_TO_CALC!) || 2.5,
    },
  } satisfies AppConfigType;
});
