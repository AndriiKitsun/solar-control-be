import { Routes } from '@nestjs/core/router/interfaces/routes.interface';
import { SensorsModule } from './sensors/sensors.module';
import { sensorsRoutes } from './sensors/sensors.routes';

export const appRoutes: Routes = [
  {
    path: 'sensors',
    module: SensorsModule,
    children: sensorsRoutes,
  },
];
