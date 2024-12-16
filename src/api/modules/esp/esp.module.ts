import { Module } from '@nestjs/common';
import { EspApiService } from './esp.service';
import { HttpApiModule } from '../../common';
import { ESP_WS_SERVICE } from './esp.constants';
import { FakeEspWsService } from './ws/fake-esp-ws.service';

@Module({
  imports: [HttpApiModule],
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
