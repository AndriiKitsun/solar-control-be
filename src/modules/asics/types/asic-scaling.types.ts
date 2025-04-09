import { Maybe } from '@common/types';
import { Asic } from '../entities';
import { AsicPerfSummary } from '@api/modules/asics/collections/other';

export interface AsicWithPerfSummary {
  asic: Maybe<Asic>;
  perfSummary: Maybe<AsicPerfSummary>;
}
