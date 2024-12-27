import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpClientProvider } from './http-client.provider';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpClientProvider,
    }),
  ],
  exports: [HttpModule],
})
export class HttpClientModule {}
