import { Module } from '@nestjs/common';
import { EspPhase1Module } from './esp-phase-1/esp-phase-1.module';

@Module({
  imports: [EspPhase1Module],
})
export class SensorsModule {}
