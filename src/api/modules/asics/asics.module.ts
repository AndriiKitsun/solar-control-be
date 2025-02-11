import { Module } from '@nestjs/common';
import { AsicsApiService } from './asics.service';
import { HttpModule } from '@nestjs/axios';
import { AppConfig, AppConfigType } from '@config/app.config';

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
  providers: [AsicsApiService],
  exports: [AsicsApiService],
})
export class AsicsApiModule {}
