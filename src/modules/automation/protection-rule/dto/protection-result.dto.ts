import { ProtectionRuleResultDto } from './protection-rule-result.dto';

export class ProtectionResultDto {
  triggered!: boolean;
  rules = new ProtectionRuleResultDto();
}
