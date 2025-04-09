import { Module } from '@nestjs/common';
import { ControlRuleModule } from './control-rule/control-rule.module';
import { ProtectionRuleModule } from './protection-rule/protection-rule.module';

const PROVIDERS = [ControlRuleModule, ProtectionRuleModule];

@Module({
  imports: PROVIDERS,
  exports: PROVIDERS,
})
export class AutomationModule {}
