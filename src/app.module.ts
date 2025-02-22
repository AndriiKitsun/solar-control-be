import {
  Module,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { PzemsModule } from '@modules/pzems';
import { AsicsModule } from '@modules/asics';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from '@config/app.config';
import { EspConfig } from '@config/esp.config';
import { PostgresConfig } from '@config/postgres.config';
import { APP_INTERCEPTOR, APP_PIPE, APP_FILTER } from '@nestjs/core';
import { PostgresProvider, PinoLoggerProvider } from '@providers/index';
import { convertToHttpException } from '@common/utils';
import { SettingsModule } from '@modules/settings';
import { RelaysModule } from '@modules/relays';
import { LoggerModule } from 'nestjs-pino';
import { TypeORMExceptionFilter } from '@common/filters';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProtectionRulesModule } from '@modules/protection-rules';
import { SensorsModule } from '@modules/sensors';

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
    EventEmitterModule.forRoot(),
    AsicsModule,
    ProtectionRulesModule,
    PzemsModule,
    RelaysModule,
    SensorsModule,
    SettingsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: TypeORMExceptionFilter,
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
