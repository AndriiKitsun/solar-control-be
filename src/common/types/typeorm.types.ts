import { TypeORMRequestCacheConfig } from '../interfaces';

export type TypeORMCacheConfig<T extends string> = Record<
  T,
  TypeORMRequestCacheConfig
>;
