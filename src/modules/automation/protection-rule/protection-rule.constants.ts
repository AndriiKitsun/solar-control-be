import { ProtectionRuleCacheKey } from './enums';
import { DateMilliseconds } from '@common/enums/date.enum';
import { TypeORMCacheConfig } from '@common/types';

export const PROTECTION_STRATEGY_CONFIG = 'PROTECTION_STRATEGY_CONFIG';

export const PROTECTION_RULES_CACHE_CONFIG: TypeORMCacheConfig<ProtectionRuleCacheKey> =
  {
    [ProtectionRuleCacheKey.GET_RULES]: {
      id: ProtectionRuleCacheKey.GET_RULES,
      milliseconds: DateMilliseconds.DAY,
    },
    [ProtectionRuleCacheKey.GET_ENABLED_RULES]: {
      id: ProtectionRuleCacheKey.GET_ENABLED_RULES,
      milliseconds: DateMilliseconds.DAY,
    },
  };

export const PROTECTION_RESULT_KEY = 'protectionResult';
