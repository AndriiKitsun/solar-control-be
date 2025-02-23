import { Module } from '@nestjs/common';
import { ProtectionRulesService } from './protection-rules.service';
import { ProtectionRulesController } from './protection-rules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProtectionRule } from './entities';
import { ProtectionRulesRepository } from './protection-rules.repository';
import { EspApiModule, EspSensorId } from '@api/modules/esp';
import { PROTECTION_STRATEGY_CONFIG } from './protection-rules.constants';
import {
  DcBatteryProtectionStrategy,
  AcOutputProtectionStrategy,
  ProtectionRulesExecutor,
  ProtectionStrategy,
} from './strategies';
import { LogsModule } from '../logs';

const STRATEGIES = [AcOutputProtectionStrategy, DcBatteryProtectionStrategy];

@Module({
  imports: [
    TypeOrmModule.forFeature([ProtectionRule]),
    EspApiModule,
    LogsModule,
  ],
  controllers: [ProtectionRulesController],
  providers: [
    ProtectionRulesService,
    ProtectionRulesRepository,
    ProtectionRulesExecutor,
    {
      provide: PROTECTION_STRATEGY_CONFIG,
      useFactory: (
        ...strategies: ProtectionStrategy[]
      ): Record<EspSensorId, ProtectionStrategy> => {
        return strategies.reduce(
          (acc, strategy) => {
            acc[strategy.name] = strategy;

            return acc;
          },
          {} as Record<EspSensorId, ProtectionStrategy>,
        );
      },
      inject: STRATEGIES,
    },
    ...STRATEGIES,
  ],
})
export class ProtectionRulesModule {}
