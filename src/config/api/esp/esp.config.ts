import { registerAs } from '@nestjs/config';

const ESP_NAMESPACE = 'EspNamespace';

export type EspConfigType = {
  endpoint: string;
  wsEndpoint: string;
};

export const EspConfig = registerAs<EspConfigType>(ESP_NAMESPACE, () => {
  return {
    endpoint: process.env.ESP_ENDPOINT,
    wsEndpoint: process.env.ESP_WS_ENDPOINT,
  } as EspConfigType;
});
