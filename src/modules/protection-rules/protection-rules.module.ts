import { Module } from '@nestjs/common';
import { ProtectionRulesService } from './protection-rules.service';
import { ProtectionRulesController } from './protection-rules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProtectionRule } from './entities';
import { ProtectionRulesRepository } from './protection-rules.repository';
import { EspApiModule } from '@api/modules/esp';
import { PROTECTION_STRATEGY_CONFIG } from './protection-rules.constants';
import {
  DcBatteryProtectionStrategy,
  AcOutputProtectionStrategy,
  ProtectionStrategy,
} from './strategies';
import { LogsModule } from '../logs/logs.module';
import { SensorId } from '../sensors/enums';
import { AsicsModule } from '../asics/asics.module';
import { ProtectionRulesExecutor } from './protection-rules.executor';
import { RelaysModule } from '../relays/relays.module';

const STRATEGIES = [AcOutputProtectionStrategy, DcBatteryProtectionStrategy];

@Module({
  imports: [
    TypeOrmModule.forFeature([ProtectionRule]),
    EspApiModule,
    LogsModule,
    AsicsModule,
    RelaysModule,
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
      ): Record<SensorId, ProtectionStrategy> => {
        return strategies.reduce(
          (acc, strategy) => {
            acc[strategy.name] = strategy;

            return acc;
          },
          {} as Record<SensorId, ProtectionStrategy>,
        );
      },
      inject: STRATEGIES,
    },
    ...STRATEGIES,
  ],
})
export class ProtectionRulesModule {}
