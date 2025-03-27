import { TypeORMCacheConfig } from '@common/types';
import { ControlRulesCacheKey } from './enums';
import { DateMilliseconds } from '@common/enums';

export const CONTROL_RULE_CACHE_CONFIG: TypeORMCacheConfig<ControlRulesCacheKey> =
  {
    [ControlRulesCacheKey.GET_RULES]: {
      id: ControlRulesCacheKey.GET_RULES,
      milliseconds: DateMilliseconds.DAY,
    },
  };

export const CONTROL_RULE_SAVED_EVENT = 'controlRule:saved';
