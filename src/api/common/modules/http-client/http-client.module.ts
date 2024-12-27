import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpClientService } from './http-client.service';
import { HttpClientProvider } from './http-client.provider';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpClientProvider,
    }),
  ],
  providers: [HttpClientService],
  exports: [HttpClientService],
})
export class HttpClientModule {}
