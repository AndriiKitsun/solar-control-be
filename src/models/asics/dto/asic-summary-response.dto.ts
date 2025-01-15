import { AsicMinerState } from '@api/modules';

export class AsicSummaryResponseDto {
  hostname!: string;
  ip!: string;
  state?: AsicMinerState;
  avgHashRate?: number;
  maxChipTemp?: number;
  powerConsumption?: number;
  avgFanSpeed?: number;
}
