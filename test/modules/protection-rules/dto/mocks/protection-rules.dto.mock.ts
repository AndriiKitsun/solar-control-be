import { ProtectionRuleDto } from '@modules/protection-rules/dto';

export class ProtectionRuleDtoMock {
  static readonly protectionRuleDtoMock: ProtectionRuleDto = {
    min: 180.3,
    max: 240,
    enabled: true,
  };
}
