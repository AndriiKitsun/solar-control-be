import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import {
  AsicsAuthApiService,
  AsicsAutotuneApiService,
  AsicsMiningApiService,
  AsicsOtherApiService,
  AsicsSettingsApiService,
} from './collections';
import { AsicsApiFacade } from './services';
import { AsicsConfigType, AsicsConfig } from '@config/asics.config';

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
      useFactory: (config: AsicsConfigType) => {
        return {
          timeout: config.httpTimeout,
        };
      },
      inject: [AsicsConfig.KEY],
    }),
  ],
  providers: PROVIDERS,
  exports: [AsicsApiFacade],
})
export class AsicsApiModule {}
