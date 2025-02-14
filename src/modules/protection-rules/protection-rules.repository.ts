import { Injectable } from '@nestjs/common';
import { ProtectionRule } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProtectionRulesRepository {
  constructor(
    @InjectRepository(ProtectionRule)
    private readonly repository: Repository<ProtectionRule>,
  ) {}

  getRules(): Promise<ProtectionRule[]> {
    return this.repository.find();
  }
}
