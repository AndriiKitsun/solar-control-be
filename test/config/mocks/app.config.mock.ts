import { AppConfigType } from '@config/app.config';
import { NodeEnv, PinoLogLevel } from '@common/enums';

export const AppConfigMock: AppConfigType = {
  env: NodeEnv.DEVELOPMENT,
  port: 3000,
  http: {
    espTimeout: 6000,
    asicsTimeout: 1000,
  },
  feature: {
    clearSensors: false,
    useEspAvgVoltage: true,
    sensorCalcPeriod: 2,
  },
  logLevel: PinoLogLevel.TRACE,
};
