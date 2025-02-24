import { Module } from '@nestjs/common';
import { ESP_WS_SERVICE } from './constants';
import { AppConfig, AppConfigType } from '@config/app.config';
import { HttpModule } from '@nestjs/axios';
import { EspSensorsWsService } from './ws';
import {
  EspPzemsApiService,
  EspRelaysApiService,
  EspProtectionRulesApiService,
} from './collections';

const PROVIDERS = [
  EspProtectionRulesApiService,
  EspPzemsApiService,
  EspRelaysApiService,
];

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (config: AppConfigType) => {
        return {
          timeout: config.http.espTimeout,
        };
      },
      inject: [AppConfig.KEY],
    }),
  ],
  providers: [
    ...PROVIDERS,
    {
      provide: ESP_WS_SERVICE,
      useClass: EspSensorsWsService,
    },
  ],
  exports: [...PROVIDERS, ESP_WS_SERVICE],
})
export class EspApiModule {}
