import { ProtectionRulesResultDto } from './dto';
import { ProtectionRuleId } from './enums';
import { ProtectionRule } from './entities';
import { ProtectionStrategy } from './strategies';
import { EspSensorId } from '@api/modules/esp';

export type ProtectionRulesResult = Partial<ProtectionRulesResultDto>;
export type ProtectionMappedRule = Partial<
  Record<ProtectionRuleId, ProtectionRule>
>;
export type ProtectionStrategyConfig = Partial<
  Record<EspSensorId, ProtectionStrategy>
>;
