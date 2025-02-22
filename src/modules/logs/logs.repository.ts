import { Injectable } from '@nestjs/common';
import { Log } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LogsRepository {
  constructor(
    @InjectRepository(Log)
    private readonly repository: Repository<Log>,
  ) {}

  // getRules(): Promise<Log[]> {
  //   return this.repository.find({
  //     cache: PROTECTION_RULES_CACHE_CONFIG.getRules,
  //   });
  // }
  //
  // async saveRule(id: ProtectionRuleId, ruleDto: LogDto): Promise<Log> {
  //   const payload: Log = { id, ...ruleDto };
  //
  //   const rule = await this.repository.save(payload);
  //
  //   await this.repository.manager.connection.queryResultCache?.remove([
  //     PROTECTION_RULES_CACHE_CONFIG.getRules.id,
  //     PROTECTION_RULES_CACHE_CONFIG.getEnabledRules.id,
  //   ]);
  //
  //   return rule;
  // }
}
