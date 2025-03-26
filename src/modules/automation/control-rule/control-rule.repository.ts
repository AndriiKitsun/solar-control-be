import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ControlRule } from './entities';
import { CONTROL_RULE_CACHE_CONFIG } from './control-rule.constants';
import { ControlRuleId } from './enums';
import { ControlRuleDto } from './dto';

@Injectable()
export class ControlRuleRepository {
  constructor(
    @InjectRepository(ControlRule)
    private readonly repository: Repository<ControlRule>,
  ) {}

  getRules(): Promise<ControlRule[]> {
    return this.repository.find({
      cache: CONTROL_RULE_CACHE_CONFIG.getRules,
    });
  }

  async saveRule(
    id: ControlRuleId,
    ruleDto: ControlRuleDto,
  ): Promise<ControlRule> {
    const payload: ControlRule = { id, ...ruleDto };

    const rule = await this.repository.save(payload);

    await this.repository.manager.connection.queryResultCache?.remove([
      CONTROL_RULE_CACHE_CONFIG.getRules.id,
    ]);

    return rule;
  }
}
