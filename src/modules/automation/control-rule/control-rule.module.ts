import { Module } from '@nestjs/common';
import { ControlRuleService } from './control-rule.service';
import { ControlRuleController } from './control-rule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControlRule } from './entities';
import { ControlRuleRepository } from './control-rule.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ControlRule])],
  controllers: [ControlRuleController],
  providers: [ControlRuleService, ControlRuleRepository],
})
export class ControlRuleModule {}
