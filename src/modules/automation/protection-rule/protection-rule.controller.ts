import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { ProtectionRuleService } from './protection-rule.service';
import { ProtectionRule } from './entities';
import { ProtectionRuleDto } from './dto';
import { ProtectionRuleParams } from './params';
import { Observable } from 'rxjs';

@Controller('automation/protection')
export class ProtectionRuleController {
  constructor(private readonly protectionRuleService: ProtectionRuleService) {}

  @Get()
  getRules(): Promise<ProtectionRule[]> {
    return this.protectionRuleService.getRules();
  }

  @Sse('sse')
  getProtectionResultStream(): Observable<MessageEvent> {
    return this.protectionRuleService.getProtectionResultStream();
  }

  @Put(':id')
  saveRule(
    @Param() params: ProtectionRuleParams,
    @Body() ruleDto: ProtectionRuleDto,
  ): Promise<ProtectionRule> {
    return this.protectionRuleService.saveRule(params.id, ruleDto);
  }
}
