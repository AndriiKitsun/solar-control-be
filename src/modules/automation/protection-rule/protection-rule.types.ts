import { ProtectionRulesResultDto } from './dto';
import { ProtectionRuleId } from './enums';
import { ProtectionRule } from './entities';

export type ProtectionRulesResult = Partial<ProtectionRulesResultDto>;
export type ProtectionMappedRule = Partial<
  Record<ProtectionRuleId, ProtectionRule>
>;
