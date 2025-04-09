import { Module } from '@nestjs/common';
import { ESP_WS_SERVICE } from './constants';
import { HttpModule } from '@nestjs/axios';
import {
  EspPzemsApiService,
  EspRelaysApiService,
  EspProtectionRulesApiService,
} from './collections';
import { EspSensorsWsService } from './ws';
import { EspConfig, EspConfigType } from '@config/esp.config';

const PROVIDERS = [
  EspProtectionRulesApiService,
  EspPzemsApiService,
  EspRelaysApiService,
];

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (config: EspConfigType) => {
        return {
          timeout: config.httpTimeout,
        };
      },
      inject: [EspConfig.KEY],
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
