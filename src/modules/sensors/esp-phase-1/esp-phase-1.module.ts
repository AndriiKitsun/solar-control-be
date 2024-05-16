import { Module } from '@nestjs/common';
import { EspPhase1Service } from './esp-phase-1.service';
import { EspPhase1Controller } from './esp-phase-1.controller';

@Module({
  controllers: [EspPhase1Controller],
  providers: [EspPhase1Service],
})
export class EspPhase1Module {}
