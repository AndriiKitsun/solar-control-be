import { Controller, Get, Body, Put, Param } from '@nestjs/common';
import { ProtectionRulesService } from './protection-rules.service';
import { ProtectionRule } from './entities';
import { ProtectionRuleDto } from './dto';
import { ProtectionRuleParams } from './params';

@Controller('protection-rules')
export class ProtectionRulesController {
  constructor(
    private readonly protectionRulesService: ProtectionRulesService,
  ) {}

  @Get()
  getRules(): Promise<ProtectionRule[]> {
    return this.protectionRulesService.getRules();
  }

  @Put(':id')
  saveRule(
    @Param() params: ProtectionRuleParams,
    @Body() ruleDto: ProtectionRuleDto,
  ): Promise<ProtectionRule> {
    return this.protectionRulesService.saveRule(params.id, ruleDto);
  }
}
