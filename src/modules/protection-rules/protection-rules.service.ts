import { Injectable } from '@nestjs/common';
import { ProtectionRuleDto } from './dto';
import { ProtectionRulesRepository } from './protection-rules.repository';
import { ProtectionRule } from './entities';

@Injectable()
export class ProtectionRulesService {
  constructor(
    private readonly protectionRulesRepository: ProtectionRulesRepository,
  ) {}

  upsertRule(protectionRuleDto: ProtectionRuleDto) {
    console.log(`protectionRuleDto -->`, protectionRuleDto);

    return 'This action adds a new protectionRule';
  }

  getRules(): Promise<ProtectionRule[]> {
    return this.protectionRulesRepository.getRules();
  }
}
