import { Controller, Get, Body, Put } from '@nestjs/common';
import { ProtectionRulesService } from './protection-rules.service';
import { ProtectionRule } from './entities';
import { ProtectionRuleDto } from './dto';

@Controller('protection-rules')
export class ProtectionRulesController {
  constructor(
    private readonly protectionRulesService: ProtectionRulesService,
  ) {}

  @Put()
  saveRule(
    @Body() protectionRuleDto: ProtectionRuleDto,
  ): Promise<ProtectionRule> {
    return this.protectionRulesService.saveRule(protectionRuleDto);
  }

  @Get()
  getRules(): Promise<ProtectionRule[]> {
    return this.protectionRulesService.getRules();
  }
}
