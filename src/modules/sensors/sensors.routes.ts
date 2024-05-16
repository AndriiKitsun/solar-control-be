import { Routes } from '@nestjs/core/router/interfaces/routes.interface';
import { EspPhase1Module } from './esp-phase-1/esp-phase-1.module';

export const sensorsRoutes: Routes = [
  {
    path: 'esp-phase-1',
    module: EspPhase1Module,
  },
];
