import { Module } from '@nestjs/common';
import { SensorsModule } from './sensors/sensors.module';
import { RouterModule } from '@nestjs/core';
import { appRoutes } from './app.routes';

@Module({
  imports: [RouterModule.register(appRoutes), SensorsModule],
})
export class AppModule {}
