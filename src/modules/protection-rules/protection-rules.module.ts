import { Module } from '@nestjs/common';
import { ProtectionRulesService } from './protection-rules.service';
import { ProtectionRulesController } from './protection-rules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProtectionRule } from './entities';
import { ProtectionRulesRepository } from './protection-rules.repository';
import { EspApiModule } from '@api/modules/esp';
import { PROTECTION_STRATEGIES } from './protection-rules.constants';
import {
  DcBatteryProtectionStrategy,
  AcOutputProtectionStrategy,
  ProtectionRulesExecutor,
} from './strategies';

const STRATEGIES = [AcOutputProtectionStrategy, DcBatteryProtectionStrategy];

@Module({
  imports: [TypeOrmModule.forFeature([ProtectionRule]), EspApiModule],
  controllers: [ProtectionRulesController],
  providers: [
    ProtectionRulesService,
    ProtectionRulesRepository,
    ProtectionRulesExecutor,
    {
      provide: PROTECTION_STRATEGIES,
      useFactory: (...strategies): any[] => strategies,
      inject: STRATEGIES,
    },
    ...STRATEGIES,
  ],
})
export class ProtectionRulesModule {}
