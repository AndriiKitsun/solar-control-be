import { Module } from '@nestjs/common';
import { EspApiService } from './esp.service';
import { ESP_WS_SERVICE } from './esp.constants';
import { FakeEspWsService } from './ws/fake-esp-ws.service';
import { HttpClientModule } from '../../common';

@Module({
  imports: [HttpClientModule],
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
