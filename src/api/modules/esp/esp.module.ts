import { Module } from '@nestjs/common';
import { EspApiService } from './esp.service';
import { ESP_WS_SERVICE } from './esp.constants';
import { AppConfig, AppConfigType } from '@config/app.config';
import { HttpModule } from '@nestjs/axios';
import { FakeEspWsService } from './ws/fake-esp-ws.service';

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
    EspApiService,
    {
      provide: ESP_WS_SERVICE,
      useClass: FakeEspWsService,
    },
  ],
  exports: [EspApiService, ESP_WS_SERVICE],
})
export class EspApiModule {}
