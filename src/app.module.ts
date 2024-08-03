import { Module } from '@nestjs/common';
import { PzemsModule } from '@models/pzems';
import { AsicsModule } from '@models/asics';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from '@config/app';
import { EspConfig } from '@config/api';
import { PostgresConfig } from '@config/database';
import { PostgresProvider } from '@providers/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, EspConfig, PostgresConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresProvider,
    }),
    PzemsModule,
    AsicsModule,
  ],
})
export class AppModule {}
