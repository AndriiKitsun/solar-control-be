import { Module } from '@nestjs/common';
import { AsicsService } from './asics.service';
import { AsicsController } from './asics.controller';
import { AsicsRepository } from './asics.repository';
import { AsicsApiModule } from '@api/modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asic } from './entities';
import { LogsModule } from '../logs/logs.module';
import { AsicsAutomationService } from './asics-automation.service';
import { AsicsScaleUpStrategy } from './strategies/scaling/asics-scale-up.strategy';
import { AsicsScaleDownStrategy } from './strategies/scaling/asics-scale-down.strategy';
import { AsicsScalingStrategyExecutor } from './strategies/scaling/asics-scaling-strategy-executor.service';
import { ControlRuleModule } from '../automation/control-rule/control-rule.module';

const SCALING_STRATEGIES = [
  AsicsScaleUpStrategy,
  AsicsScaleDownStrategy,
  AsicsScalingStrategyExecutor,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Asic]),
    AsicsApiModule,
    LogsModule,
    ControlRuleModule,
  ],
  controllers: [AsicsController],
  providers: [
    AsicsService,
    AsicsRepository,
    AsicsAutomationService,
    ...SCALING_STRATEGIES,
  ],
  exports: [AsicsService],
})
export class AsicsModule {}
