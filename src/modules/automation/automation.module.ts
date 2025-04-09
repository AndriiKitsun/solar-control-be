import { Module } from '@nestjs/common';
import { ControlRuleModule } from './control-rule/control-rule.module';

const PROVIDERS = [ControlRuleModule];

@Module({
  imports: PROVIDERS,
  exports: PROVIDERS,
})
export class AutomationModule {}
