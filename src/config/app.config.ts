import { registerAs } from '@nestjs/config';
import { initCrypto } from '@common/utils';
import { NodeEnv, PinoLogLevel } from '@common/enums';
import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsString,
  IsBoolean,
} from 'class-validator';
import { validateEnv } from '@common/validators';

export const APP_NAMESPACE = 'APP_NAMESPACE';

export interface AppConfigType {
  env: NodeEnv;
  port: number;
  feature: {
    clearSensors: boolean;
    useEspAvgVoltage: boolean;
    sensorCalcPeriod: number;
    asicsControlEnabled: boolean;
  };
  logLevel: PinoLogLevel;
}

class AppEnvVariables {
  @IsEnum(NodeEnv)
  @IsNotEmpty()
  NODE_ENV!: NodeEnv;

  @IsNumber()
  @Min(0)
  @Max(65535)
  @IsNotEmpty()
  PORT!: number;

  @IsEnum(PinoLogLevel)
  @IsNotEmpty()
  LOG_LEVEL!: PinoLogLevel;

  @IsString()
  @IsNotEmpty()
  AUTH_ENCODING_KEY!: string;

  @IsString()
  @IsNotEmpty()
  AUTH_ENCODING_ALGORITHM!: string;

  @IsBoolean()
  @IsNotEmpty()
  SENSORS_CLEAR_ON_START!: boolean;

  @IsBoolean()
  @IsNotEmpty()
  SENSORS_USE_ESP_AVG_VOLTAGE!: boolean;

  @IsBoolean()
  @IsNotEmpty()
  FEATURE_ASICS_CONTROL_ENABLED!: boolean;

  @IsNumber()
  @IsNotEmpty()
  SENSORS_CALC_PERIOD!: number;
}

export const AppConfig = registerAs<AppConfigType>(
  APP_NAMESPACE,
  (): AppConfigType => {
    const config = validateEnv(AppEnvVariables);

    initCrypto();

    return {
      env: config.NODE_ENV,
      port: config.PORT,
      feature: {
        clearSensors: config.SENSORS_CLEAR_ON_START,
        useEspAvgVoltage: config.SENSORS_USE_ESP_AVG_VOLTAGE,
        sensorCalcPeriod: config.SENSORS_CALC_PERIOD,
        asicsControlEnabled: config.FEATURE_ASICS_CONTROL_ENABLED,
      },
      logLevel: config.LOG_LEVEL,
    };
  },
);
