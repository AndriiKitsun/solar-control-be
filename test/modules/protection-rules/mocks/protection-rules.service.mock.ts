import { ClassMock } from '@common/types/test.types';
import { Observable, of } from 'rxjs';
import { ProtectionRulesRepositoryMock } from './protection-rules.repository.mock';
import { ProtectionRuleService } from '@modules/automation/protection-rule/protection-rule.service';
import { Sensor } from '@modules/sensors/entities';
import { ProtectionRule } from '@modules/automation/protection-rule/entities';
import { ProtectionRuleId } from '@modules/automation/protection-rule/enums';
import {
  ProtectionRuleDto,
  ProtectionResultDto,
} from '@modules/automation/protection-rule/dto';
import { MessageEvent } from '@nestjs/common';

export class ProtectionRulesServiceMock
  implements ClassMock<ProtectionRuleService>
{
  async onSensorsEvent(sensor: Sensor): Promise<void> {
    return;
  }

  async handleProtectionResult(result: ProtectionResultDto): Promise<void> {
    return Promise.resolve(undefined);
  }

  async getRules(): Promise<ProtectionRule[]> {
    return ProtectionRulesRepositoryMock.protectionRulesMock;
  }

  getProtectionResultStream(): Observable<MessageEvent> {
    return of();
  }

  async saveRule(
    id: ProtectionRuleId,
    ruleDto: ProtectionRuleDto,
  ): Promise<ProtectionRule> {
    return ProtectionRulesRepositoryMock.protectionRuleMock;
  }
}
