import { Maybe } from '@common/types';
import { Asic } from '../entities';
import { AsicPerfSummary } from '@api/modules/asics';

export interface AsicWithPerfSummary {
  asic: Maybe<Asic>;
  perfSummary: Maybe<AsicPerfSummary>;
}
