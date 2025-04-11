import { TypeORMCacheConfig } from '@common/types';
import { DateMilliseconds } from '@common/enums';

export const CONTROL_RULE_CACHE_CONFIG: TypeORMCacheConfig = {
  getRules: {
    id: 'control_rule:get-rules',
    milliseconds: DateMilliseconds.DAY,
  },
};

export const CONTROL_RULE_SAVED_EVENT = 'controlRule:saved';
