import { AppConfigType } from '@config/app';
import { NodeEnv } from '@common/enums';

export const AppConfigMock: AppConfigType = {
  env: NodeEnv.DEVELOPMENT,
  port: '3000',
  http: {
    timeout: 5000,
  },
  feature: {
    clearPzems: false,
    pzemCalcPeriod: 2,
  },
  logLevel: 'info',
};
