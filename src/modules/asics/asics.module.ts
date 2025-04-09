import { Module } from '@nestjs/common';
import { AsicsService } from './asics.service';
import { AsicsController } from './asics.controller';
import { AsicsRepository } from './asics.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asic } from './entities';
import { LogsModule } from '../logs/logs.module';
import { AsicsAutomationService } from './asics-automation.service';
import { ControlRuleModule } from '../automation/control-rule/control-rule.module';
import { AsicsApiModule } from '@api/modules/asics';
import {
  AsicsScalingUpStrategy,
  AsicsScalingDownStrategy,
  AsicsScalingStrategyExecutor,
} from './strategies';

const SCALING_STRATEGIES = [
  AsicsScalingUpStrategy,
  AsicsScalingDownStrategy,
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
