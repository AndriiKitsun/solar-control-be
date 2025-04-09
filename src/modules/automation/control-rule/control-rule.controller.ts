import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { ControlRuleService } from './control-rule.service';
import { ControlRule } from './entities';
import { ControlRuleParams } from './params';
import { ControlRuleDto } from './dto';

@Controller('automation/control')
export class ControlRuleController {
  constructor(private readonly controlRuleService: ControlRuleService) {}

  @Get()
  getRules(): Promise<ControlRule[]> {
    return this.controlRuleService.getRules();
  }

  @Put(':id')
  saveRule(
    @Param() params: ControlRuleParams,
    @Body() ruleDto: ControlRuleDto,
  ): Promise<ControlRule> {
    return this.controlRuleService.saveRule(params.id, ruleDto);
  }
}
