import { registerAs } from '@nestjs/config';
import { IsString, IsNotEmpty } from 'class-validator';
import { validateEnv } from '@common/validators';

const ESP_NAMESPACE = 'ESP_NAMESPACE';

export interface EspConfigType {
  endpoint: string;
  wsEndpoint: string;
}

class EspEnvVariables {
  @IsString()
  @IsNotEmpty()
  ESP_ENDPOINT!: string;

  @IsString()
  @IsNotEmpty()
  ESP_WS_ENDPOINT!: string;
}

export const EspConfig = registerAs<EspConfigType>(
  ESP_NAMESPACE,
  (): EspConfigType => {
    const config = validateEnv(EspEnvVariables);

    return {
      endpoint: config.ESP_ENDPOINT,
      wsEndpoint: config.ESP_WS_ENDPOINT,
    };
  },
);
