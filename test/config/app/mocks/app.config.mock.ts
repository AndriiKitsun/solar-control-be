import { AppConfigType } from '@config/app';

export const AppConfigMock: AppConfigType = {
  port: '3000',
  http: {
    timeout: 5000,
  },
  feature: {
    clearPzems: false,
  },
};
