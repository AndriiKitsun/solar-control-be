import { Injectable } from '@nestjs/common';
import { ProtectionRuleDto } from './dto';
import { ProtectionRulesRepository } from './protection-rules.repository';
import { ProtectionRule } from './entities';

@Injectable()
export class ProtectionRulesService {
  constructor(
    private readonly protectionRulesRepository: ProtectionRulesRepository,
  ) {}

  saveRule(protectionRuleDto: ProtectionRuleDto): Promise<ProtectionRule> {
    return this.protectionRulesRepository.saveRule(protectionRuleDto);
  }

  getRules(): Promise<ProtectionRule[]> {
    return this.protectionRulesRepository.getRules();
  }
}
