import { Module } from '@nestjs/common';
import { EspApiService } from './esp.service';
import { ESP_WS_SERVICE } from './esp.constants';
import { HttpClientModule } from '../../common';
import { EspWsService } from './ws/esp-ws.service';

@Module({
  imports: [HttpClientModule],
  providers: [
    EspApiService,
    {
      provide: ESP_WS_SERVICE,
      useClass: EspWsService,
    },
  ],
  exports: [EspApiService, ESP_WS_SERVICE],
})
export class EspApiModule {}
