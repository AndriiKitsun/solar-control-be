import { EspHttpBaseApiService } from '../../services';
import { Injectable } from '@nestjs/common';
import { ProtectionRuleId } from '@modules/protection-rules/enums';
import { ProtectionRuleDto } from '@modules/protection-rules/dto';
import { EspProtectionRule } from './protection-rules.types';

@Injectable()
export class EspProtectionRulesApiService extends EspHttpBaseApiService {
  saveProtectionRule(
    id: ProtectionRuleId,
    ruleDto: ProtectionRuleDto,
  ): Promise<void> {
    const url = this.buildUrl('protection-rules');

    const payload: EspProtectionRule = {
      id,
      min: ruleDto.enabled ? ruleDto.min : 0,
      max: ruleDto.enabled ? ruleDto.max : 0,
    };

    return this.put(url, payload);
  }
}
