import { ProtectionRulesCacheKey } from './enums';
import { DateMilliseconds } from '@common/enums/date.enum';
import { TypeORMCacheConfig } from '@common/types';

export const PROTECTION_STRATEGY_CONFIG = 'PROTECTION_STRATEGY_CONFIG';

export const PROTECTION_RULES_CACHE_CONFIG: TypeORMCacheConfig<ProtectionRulesCacheKey> =
  {
    [ProtectionRulesCacheKey.GET_RULES]: {
      id: ProtectionRulesCacheKey.GET_RULES,
      milliseconds: DateMilliseconds.DAY,
    },
    [ProtectionRulesCacheKey.GET_ENABLED_RULES]: {
      id: ProtectionRulesCacheKey.GET_ENABLED_RULES,
      milliseconds: DateMilliseconds.DAY,
    },
  };
