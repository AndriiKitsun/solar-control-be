import { TypeORMCacheConfig } from '@common/types';
import { ControlRuleCacheKey } from './enums';
import { DateMilliseconds } from '@common/enums';

export const CONTROL_RULE_CACHE_CONFIG: TypeORMCacheConfig<ControlRuleCacheKey> =
  {
    [ControlRuleCacheKey.GET_RULES]: {
      id: ControlRuleCacheKey.GET_RULES,
      milliseconds: DateMilliseconds.DAY,
    },
  };

export const CONTROL_RULE_SAVED_EVENT = 'controlRule:saved';
