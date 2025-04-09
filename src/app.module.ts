import {
  Module,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { PzemsModule } from '@modules/pzems/pzems.module';
import { AsicsModule } from '@modules/asics/asics.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from '@config/app.config';
import { EspConfig } from '@config/esp.config';
import { PostgresConfig } from '@config/postgres.config';
import { APP_INTERCEPTOR, APP_PIPE, APP_FILTER } from '@nestjs/core';
import { PostgresProvider, PinoLoggerProvider } from '@providers/index';
import { convertToHttpException } from '@common/utils';
import { SettingsModule } from '@modules/settings/settings.module';
import { RelaysModule } from '@modules/relays/relays.module';
import { LoggerModule } from 'nestjs-pino';
import { TypeORMExceptionFilter } from '@common/filters';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SensorsModule } from '@modules/sensors/sensors.module';
import { LogsModule } from '@modules/logs/logs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { AutomationModule } from '@modules/automation/automation.module';
import { AsicsConfig } from '@config/asics.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, AsicsConfig, EspConfig, PostgresConfig],
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
    ScheduleModule.forRoot({ intervals: false, timeouts: false }),
    CacheModule.register({ isGlobal: true }),
    AsicsModule,
    AutomationModule,
    LogsModule,
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
