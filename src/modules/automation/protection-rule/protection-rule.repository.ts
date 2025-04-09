import { Injectable } from '@nestjs/common';
import { ProtectionRule } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProtectionRuleDto } from './dto';
import { ProtectionRuleId } from './enums';
import { PROTECTION_RULES_CACHE_CONFIG } from './protection-rule.constants';

@Injectable()
export class ProtectionRuleRepository {
  constructor(
    @InjectRepository(ProtectionRule)
    private readonly repository: Repository<ProtectionRule>,
  ) {}

  getRules(): Promise<ProtectionRule[]> {
    return this.repository.find({
      cache: PROTECTION_RULES_CACHE_CONFIG.getRules,
    });
  }

  getEnabledRules(): Promise<ProtectionRule[]> {
    return this.repository.find({
      where: {
        enabled: true,
      },
      cache: PROTECTION_RULES_CACHE_CONFIG.getEnabledRules,
    });
  }

  async saveRule(
    id: ProtectionRuleId,
    ruleDto: ProtectionRuleDto,
  ): Promise<ProtectionRule> {
    const payload: ProtectionRule = { id, ...ruleDto };

    const rule = await this.repository.save(payload);

    await this.repository.manager.connection.queryResultCache?.remove([
      PROTECTION_RULES_CACHE_CONFIG.getRules.id,
      PROTECTION_RULES_CACHE_CONFIG.getEnabledRules.id,
    ]);

    return rule;
  }
}
