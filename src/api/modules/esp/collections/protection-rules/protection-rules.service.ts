import { EspHttpBaseService } from '../../services';
import { Injectable } from '@nestjs/common';
import { EspProtectionRule } from './protection-rules.types';

@Injectable()
export class EspProtectionRulesService extends EspHttpBaseService {
  saveProtectionRule(rule: EspProtectionRule): Promise<void> {
    const url = this.buildUrl('protection-rules');

    return this.put(url, rule);
  }
}
