import { EspHttpBaseService } from '../../services';
import { Injectable } from '@nestjs/common';
import {
  EspProtectionRule,
  EspProtectionRuleBody,
} from './protection-rules.types';

@Injectable()
export class EspProtectionRulesService extends EspHttpBaseService {
  saveProtectionRule(rule: EspProtectionRuleBody): Promise<EspProtectionRule> {
    const url = this.buildUrl('protection-rules');
    const body: EspProtectionRule = {
      id: rule.id,
      min: rule.min,
      max: rule.max,
    };

    if (!rule.enabled) {
      body.min = 0;
      body.max = 0;
    }

    return this.put(url, body);
  }
}
