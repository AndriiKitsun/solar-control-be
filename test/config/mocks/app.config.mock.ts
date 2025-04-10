import { AppConfigType } from '@config/app.config';
import { NodeEnv, PinoLogLevel } from '@common/enums';

export const AppConfigMock: AppConfigType = {
  env: NodeEnv.DEVELOPMENT,
  port: 3000,
  feature: {
    asicsControlEnabled: false,
  },
  logLevel: PinoLogLevel.TRACE,
};
