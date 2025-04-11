import { DateMilliseconds } from '@common/enums/date.enum';
import { TypeORMCacheConfig } from '@common/types';

export const PROTECTION_STRATEGY_CONFIG = 'PROTECTION_STRATEGY_CONFIG';

export const PROTECTION_RULES_CACHE_CONFIG: TypeORMCacheConfig = {
  getRules: {
    id: 'protection_rule:get-rules',
    milliseconds: DateMilliseconds.DAY,
  },
  getEnabledRules: {
    id: 'protection_rule:get-enabled-rules',
    milliseconds: DateMilliseconds.DAY,
  },
};

export const PROTECTION_RESULT_KEY = 'protectionResult';
