import { TypeORMCacheConfig } from '@common/types';
import { AsicsCacheKey } from './enums';
import { DateMilliseconds } from '@common/enums';

export const ASICS_CACHE_CONFIG: TypeORMCacheConfig<AsicsCacheKey> = {
  [AsicsCacheKey.GET_ASICS]: {
    id: AsicsCacheKey.GET_ASICS,
    milliseconds: DateMilliseconds.DAY,
  },
  [AsicsCacheKey.GET_ASIC]: {
    id: AsicsCacheKey.GET_ASIC,
    milliseconds: DateMilliseconds.DAY,
  },
};

export const ASIC_START_IDLE_TIME = 200_000; // 200s
