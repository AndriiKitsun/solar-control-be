import { Module } from '@nestjs/common';
import { PzemsModule } from '@models/pzems';
import { AsicsModule } from '@models/asics';
import { ConfigModule } from '@nestjs/config';
import { AppConfig, EspConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, EspConfig],
    }),
    PzemsModule,
    AsicsModule,
  ],
})
export class AppModule {}
