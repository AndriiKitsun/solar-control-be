import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppConfigType, AppConfig } from '@config/app.config';
import {
  AsicsAuthApiService,
  AsicsAutotuneApiService,
  AsicsMiningApiService,
  AsicsOtherApiService,
  AsicsSettingsApiService,
} from './collections';
import { AsicsApiFacade } from './services';

const PROVIDERS = [
  AsicsAuthApiService,
  AsicsAutotuneApiService,
  AsicsMiningApiService,
  AsicsOtherApiService,
  AsicsSettingsApiService,
  AsicsApiFacade,
];

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (config: AppConfigType) => {
        return {
          timeout: config.http.asicsTimeout,
        };
      },
      inject: [AppConfig.KEY],
    }),
  ],
  providers: PROVIDERS,
  exports: [AsicsApiFacade],
})
export class AsicsApiModule {}
