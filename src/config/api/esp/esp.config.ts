import { registerAs } from '@nestjs/config';

const ESP_NAMESPACE = 'EspNamespace';

export type EspConfigType = {
  endpoint: string;
};

export const EspConfig = registerAs<EspConfigType>(ESP_NAMESPACE, () => {
  return {
    endpoint: process.env.ESP_ENDPOINT,
  } as EspConfigType;
});
