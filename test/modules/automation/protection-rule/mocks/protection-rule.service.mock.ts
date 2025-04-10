import { ClassMock } from '@common/types/test.types';
import { Observable, of } from 'rxjs';
import { ProtectionRuleRepositoryMock } from './protection-rule.repository.mock';
import { ProtectionRuleService } from '@modules/automation/protection-rule/protection-rule.service';
import { ProtectionRule } from '@modules/automation/protection-rule/entities';
import { ProtectionRuleId } from '@modules/automation/protection-rule/enums';
import {
  ProtectionRuleDto,
  ProtectionResultDto,
} from '@modules/automation/protection-rule/dto';
import { MessageEvent } from '@nestjs/common';
import { ProtectionStrategyExecutorMock } from '../strategies/mocks/protection-strategy.executor.mock';
import { EspSensorsData } from '@api/modules/esp';

export class ProtectionRuleServiceMock
  implements ClassMock<ProtectionRuleService>
{
  static readonly protectionResultMessage: MessageEvent = {
    data: ProtectionStrategyExecutorMock.protectionResultMock,
  };

  async onSensorsEvent(sensor: EspSensorsData): Promise<void> {
    return;
  }

  async handleProtectionResult(result: ProtectionResultDto): Promise<void> {
    return Promise.resolve(undefined);
  }

  async getRules(): Promise<ProtectionRule[]> {
    return ProtectionRuleRepositoryMock.protectionRulesMock;
  }

  getProtectionResultStream(): Observable<MessageEvent> {
    return of(ProtectionRuleServiceMock.protectionResultMessage);
  }

  async saveRule(
    id: ProtectionRuleId,
    ruleDto: ProtectionRuleDto,
  ): Promise<ProtectionRule> {
    return ProtectionRuleRepositoryMock.protectionRuleMock;
  }
}
