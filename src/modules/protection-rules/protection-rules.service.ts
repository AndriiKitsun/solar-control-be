import { Injectable } from '@nestjs/common';
import { ProtectionRuleDto } from './dto';
import { ProtectionRulesRepository } from './protection-rules.repository';
import { ProtectionRule } from './entities';
import { ProtectionRuleId } from './enums';

@Injectable()
export class ProtectionRulesService {
  constructor(
    private readonly protectionRulesRepository: ProtectionRulesRepository,
  ) {}

  saveRule(
    id: ProtectionRuleId,
    ruleDto: ProtectionRuleDto,
  ): Promise<ProtectionRule> {
    return this.protectionRulesRepository.saveRule(id, ruleDto);
  }

  getRules(): Promise<ProtectionRule[]> {
    return this.protectionRulesRepository.getRules();
  }
}
