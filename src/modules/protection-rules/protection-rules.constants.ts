import { ProtectionRulesCacheKey, ProtectionRuleId } from './enums';
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

export const ALLOWED_RULES_TO_SAVE: ProtectionRuleId[] = [
  ProtectionRuleId.AC_OUTPUT_FREQUENCY,
  ProtectionRuleId.AC_OUTPUT_VOLTAGE,
  ProtectionRuleId.DC_BATTERY_VOLTAGE,
];

export const PROTECTION_RESULT_KEY = 'protectionResult';
