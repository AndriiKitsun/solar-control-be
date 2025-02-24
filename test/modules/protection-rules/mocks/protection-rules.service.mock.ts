import { ClassMock } from '@common/types/test.types';
import {
  ProtectionRulesService,
  ProtectionRule,
  ProtectionRuleId,
  ProtectionRuleDto,
} from '@modules/protection-rules';
import { Observable, of } from 'rxjs';
import { Sensor } from '@modules/sensors';
import { ProtectionRulesRepositoryMock } from './protection-rules.repository.mock';

export class ProtectionRulesServiceMock
  implements ClassMock<ProtectionRulesService>
{
  async onSensorsEvent(sensor: Sensor): Promise<void> {
    return;
  }

  async stopAllAsics(): Promise<void> {
    return;
  }

  async getRules(): Promise<ProtectionRule[]> {
    return ProtectionRulesRepositoryMock.protectionRulesMock;
  }

  getRulesResult(): Observable<MessageEvent> {
    return of();
  }

  async saveRule(
    id: ProtectionRuleId,
    ruleDto: ProtectionRuleDto,
  ): Promise<ProtectionRule> {
    return ProtectionRulesRepositoryMock.protectionRuleMock;
  }
}
