import { Module } from '@nestjs/common';
import { ProtectionRuleService } from './protection-rule.service';
import { ProtectionRuleController } from './protection-rule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProtectionRule } from './entities';
import { ProtectionRuleRepository } from './protection-rule.repository';
import { EspApiModule } from '@api/modules/esp';
import { PROTECTION_STRATEGY_CONFIG } from './protection-rule.constants';
import {
  DcBatteryProtectionStrategy,
  AcOutputProtectionStrategy,
  ProtectionStrategy,
} from './strategies';
import { LogsModule } from '../../logs/logs.module';
import { SensorId } from '../../sensors/enums';
import { AsicsModule } from '../../asics/asics.module';
import { ProtectionRuleExecutor } from './protection-rule.executor';

const STRATEGIES = [AcOutputProtectionStrategy, DcBatteryProtectionStrategy];

@Module({
  imports: [
    TypeOrmModule.forFeature([ProtectionRule]),
    EspApiModule,
    LogsModule,
    AsicsModule,
  ],
  controllers: [ProtectionRuleController],
  providers: [
    ProtectionRuleService,
    ProtectionRuleRepository,
    ProtectionRuleExecutor,
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
export class ProtectionRuleModule {}
