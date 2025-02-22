import { Injectable } from '@nestjs/common';
import { ProtectionRule } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProtectionRuleDto } from './dto';
import { ProtectionRuleId } from './enums';

@Injectable()
export class ProtectionRulesRepository {
  constructor(
    @InjectRepository(ProtectionRule)
    private readonly repository: Repository<ProtectionRule>,
  ) {}

  saveRule(
    id: ProtectionRuleId,
    ruleDto: ProtectionRuleDto,
  ): Promise<ProtectionRule> {
    const rule: ProtectionRule = {
      id,
      ...ruleDto,
    };

    return this.repository.save(rule);
  }

  getRules(): Promise<ProtectionRule[]> {
    return this.repository.find();
  }
}
