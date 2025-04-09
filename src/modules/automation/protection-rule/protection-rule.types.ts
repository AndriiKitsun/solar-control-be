import { ProtectionRulesResultDto } from './dto';
import { ProtectionRuleId } from './enums';
import { ProtectionRule } from './entities';
import { SensorId } from '../../sensors/enums';
import { ProtectionStrategy } from './strategies';

export type ProtectionRulesResult = Partial<ProtectionRulesResultDto>;
export type ProtectionMappedRule = Partial<
  Record<ProtectionRuleId, ProtectionRule>
>;
export type ProtectionStrategyConfig = Partial<
  Record<SensorId, ProtectionStrategy>
>;
