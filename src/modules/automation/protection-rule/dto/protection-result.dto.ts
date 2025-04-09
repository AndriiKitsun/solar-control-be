import { ProtectionRulesResultDto } from './protection-rules-result.dto';

export class ProtectionResultDto {
  triggered!: boolean;
  rules = new ProtectionRulesResultDto();
}
