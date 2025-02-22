import { DateMilliseconds } from '@common/enums/date.enum';
import { TypeormCacheConfig } from '@common/interfaces/typeorm.interface';
import { LogCacheKey } from './enums/logs.enum';

export const LOGS_CACHE_CONFIG: Record<LogCacheKey, TypeormCacheConfig> = {
  [LogCacheKey.GET_LOGS]: {
    id: LogCacheKey.GET_LOGS,
    milliseconds: DateMilliseconds.DAY,
  },
};
