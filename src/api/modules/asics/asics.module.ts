import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppConfigType, AppConfig } from '@config/app.config';
import { AsicsOtherApiService } from './collections/other';
import { AsicsAuthApiService } from './collections/auth';
import { AsicsAutotuneApiService } from './collections/autotune';
import { AsicsMiningApiService } from './collections/mining';
import { AsicsSettingsApiService } from './collections/settings';
import { AsicsApiFacade } from './services/asics-api.facade';

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
