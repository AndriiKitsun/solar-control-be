import {
  Module,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { PzemsModule } from '@models/pzems';
import { AsicsModule } from '@models/asics';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from '@config/app';
import { EspConfig } from '@config/esp';
import { PostgresConfig } from '@config/postgres';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { PostgresProvider, PinoLoggerProvider } from '@providers/index';
import { convertToHttpException } from '@common/utils';
import { SettingsModule } from '@models/settings/settings.module';
import { RelaysModule } from '@models/relays/relays.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, EspConfig, PostgresConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresProvider,
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [AppConfig.KEY],
      useFactory: PinoLoggerProvider,
    }),
    AsicsModule,
    PzemsModule,
    RelaysModule,
    SettingsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        exceptionFactory: convertToHttpException,
      }),
    },
  ],
})
export class AppModule {}
