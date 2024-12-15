import { registerAs } from '@nestjs/config';

export const APP_NAMESPACE = 'AppNamespace';

export interface AppConfigType {
  port: string;
}

export const AppConfig = registerAs<AppConfigType>(APP_NAMESPACE, () => {
  return {
    port: process.env.PORT!,
  } as AppConfigType;
});
