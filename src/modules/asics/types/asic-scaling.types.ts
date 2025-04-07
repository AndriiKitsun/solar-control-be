import { Maybe } from '@common/types';
import { Asic } from '../entities';
import { AsicPerfSummary } from '@api/modules';

export interface AsicWithSmallestPresetConfig {
  asic: Maybe<Asic>;
  perfSummary: Maybe<AsicPerfSummary>;
}
