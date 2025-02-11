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
  http: {
    espTimeout: number;
    asicsTimeout: number;
  };
  feature: {
    clearPzems: boolean;
    pzemCalcPeriod: number;
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
  PZEMS_CLEAR_ON_START!: boolean;

  @IsNumber()
  @IsNotEmpty()
  PZEMS_PERIOD_TO_CALC!: number;

  @IsNumber()
  @IsNotEmpty()
  ESP_HTTP_TIMEOUT!: number;

  @IsNumber()
  @IsNotEmpty()
  ASICS_HTTP_TIMEOUT!: number;
}

export const AppConfig = registerAs<AppConfigType>(
  APP_NAMESPACE,
  (): AppConfigType => {
    const config = validateEnv(AppEnvVariables);

    initCrypto();

    return {
      env: config.NODE_ENV,
      port: config.PORT,
      http: {
        espTimeout: config.ESP_HTTP_TIMEOUT,
        asicsTimeout: config.ASICS_HTTP_TIMEOUT,
      },
      feature: {
        clearPzems: config.PZEMS_CLEAR_ON_START,
        pzemCalcPeriod: config.PZEMS_PERIOD_TO_CALC,
      },
      logLevel: config.LOG_LEVEL,
    };
  },
);
