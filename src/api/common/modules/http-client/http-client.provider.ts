import { Injectable, Inject } from '@nestjs/common';
import {
  HttpModuleOptionsFactory,
  HttpModuleOptions,
} from '@nestjs/axios/dist/interfaces/http-module.interface';
import { AppConfig, AppConfigType } from '@config/app.config';

@Injectable()
export class HttpClientProvider implements HttpModuleOptionsFactory {
  constructor(
    @Inject(AppConfig.KEY)
    private readonly appConfig: AppConfigType,
  ) {}

  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: this.appConfig.http.espTimeout,
    };
  }
}
