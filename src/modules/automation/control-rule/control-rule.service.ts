import { Injectable } from '@nestjs/common';
import { ControlRuleRepository } from './control-rule.repository';
import { ControlRule } from './entities';
import { ControlRuleId } from './enums';
import { ControlRuleDto } from './dto';

@Injectable()
export class ControlRuleService {
  constructor(private readonly controlRuleRepository: ControlRuleRepository) {}

  getRules(): Promise<ControlRule[]> {
    return this.controlRuleRepository.getRules();
  }

  saveRule(id: ControlRuleId, ruleDto: ControlRuleDto): Promise<ControlRule> {
    return this.controlRuleRepository.saveRule(id, ruleDto);
  }
}
