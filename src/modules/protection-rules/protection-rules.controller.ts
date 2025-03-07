import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { ProtectionRulesService } from './protection-rules.service';
import { ProtectionRule } from './entities';
import { ProtectionRuleDto } from './dto';
import { ProtectionRuleParams } from './params';
import { Observable } from 'rxjs';

@Controller('protection-rules')
export class ProtectionRulesController {
  constructor(
    private readonly protectionRulesService: ProtectionRulesService,
  ) {}

  @Get()
  getRules(): Promise<ProtectionRule[]> {
    return this.protectionRulesService.getRules();
  }

  @Sse('sse')
  getProtectionResultStream(): Observable<MessageEvent> {
    return this.protectionRulesService.getProtectionResultStream();
  }

  @Put(':id')
  saveRule(
    @Param() params: ProtectionRuleParams,
    @Body() ruleDto: ProtectionRuleDto,
  ): Promise<ProtectionRule> {
    return this.protectionRulesService.saveRule(params.id, ruleDto);
  }
}
