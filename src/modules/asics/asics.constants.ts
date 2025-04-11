import { TypeORMCacheConfig } from '@common/types';
import { DateMilliseconds } from '@common/enums';

export const ASICS_CACHE_CONFIG: TypeORMCacheConfig = {
  getAsics: {
    id: 'asic:get-asics',
    milliseconds: DateMilliseconds.DAY,
  },
  getAsic: {
    id: 'asic:get-asic',
    milliseconds: DateMilliseconds.DAY,
  },
};

export const ASIC_START_IDLE_TIME = 200_000; // 200s
