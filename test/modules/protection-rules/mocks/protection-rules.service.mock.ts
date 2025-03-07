import { ClassMock } from '@common/types/test.types';
import { Observable, of } from 'rxjs';
import { ProtectionRulesRepositoryMock } from './protection-rules.repository.mock';
import { ProtectionRulesService } from '@modules/protection-rules/protection-rules.service';
import { Sensor } from '@modules/sensors/entities';
import { ProtectionRule } from '@modules/protection-rules/entities';
import { ProtectionRuleId } from '@modules/protection-rules/enums';
import {
  ProtectionRuleDto,
  ProtectionResultDto,
} from '@modules/protection-rules/dto';
import { MessageEvent } from '@nestjs/common';

export class ProtectionRulesServiceMock
  implements ClassMock<ProtectionRulesService>
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
