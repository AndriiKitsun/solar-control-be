import { Injectable } from '@nestjs/common';
import { ProtectionRule } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProtectionRuleDto } from './dto';

@Injectable()
export class ProtectionRulesRepository {
  constructor(
    @InjectRepository(ProtectionRule)
    private readonly repository: Repository<ProtectionRule>,
  ) {}

  saveRule(protectionRuleDto: ProtectionRuleDto): Promise<ProtectionRule> {
    return this.repository.save(protectionRuleDto);
  }

  getRules(): Promise<ProtectionRule[]> {
    return this.repository.find();
  }
}
