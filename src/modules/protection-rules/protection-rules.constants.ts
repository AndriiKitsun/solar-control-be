import { ProtectionRulesCacheKey } from './enums';
import { DateMilliseconds } from '@common/enums/date.enum';
import { TypeormCacheConfig } from '@common/interfaces/typeorm.interface';

export const PROTECTION_RULES_CACHE_CONFIG: Record<
  ProtectionRulesCacheKey,
  TypeormCacheConfig
> = {
  [ProtectionRulesCacheKey.PROTECTION_RULES]: {
    id: ProtectionRulesCacheKey.PROTECTION_RULES,
    milliseconds: DateMilliseconds.HOUR,
  },
};
