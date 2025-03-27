import { Injectable } from '@nestjs/common';
import { ControlRuleRepository } from './control-rule.repository';
import { ControlRule } from './entities';
import { ControlRuleId } from './enums';
import { ControlRuleDto } from './dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CONTROL_RULE_SAVED_EVENT } from './control-rule.constants';

@Injectable()
export class ControlRuleService {
  constructor(
    private readonly controlRuleRepository: ControlRuleRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  getRules(): Promise<ControlRule[]> {
    return this.controlRuleRepository.getRules();
  }

  async saveRule(
    id: ControlRuleId,
    ruleDto: ControlRuleDto,
  ): Promise<ControlRule> {
    const rule = await this.controlRuleRepository.saveRule(id, ruleDto);

    this.eventEmitter.emit(CONTROL_RULE_SAVED_EVENT, rule);

    return rule;
  }
}
