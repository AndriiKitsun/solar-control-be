import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProtectionRulesService } from './protection-rules.service';
import { ProtectionRuleDto } from './dto';

@Controller('protection-rules')
export class ProtectionRulesController {
  constructor(
    private readonly protectionRulesService: ProtectionRulesService,
  ) {}

  @Post()
  upsertRule(@Body() protectionRuleDto: ProtectionRuleDto) {
    return this.protectionRulesService.upsertRule(protectionRuleDto);
  }

  @Get()
  getRules() {
    return this.protectionRulesService.getRules();
  }
}
