import { ProtectionRulesCacheKey } from './enums';
import { DateMilliseconds } from '@common/enums/date.enum';
import { TypeormCacheConfig } from '@common/interfaces/typeorm.interface';

export const PROTECTION_STRATEGY_CONFIG = 'PROTECTION_STRATEGY_CONFIG';

export const PROTECTION_RULES_CACHE_CONFIG: Record<
  ProtectionRulesCacheKey,
  TypeormCacheConfig
> = {
  [ProtectionRulesCacheKey.GET_RULES]: {
    id: ProtectionRulesCacheKey.GET_RULES,
    milliseconds: DateMilliseconds.DAY,
  },
  [ProtectionRulesCacheKey.GET_ENABLED_RULES]: {
    id: ProtectionRulesCacheKey.GET_ENABLED_RULES,
    milliseconds: DateMilliseconds.DAY,
  },
};
