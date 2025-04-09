import { AsicMinerState } from '@api/modules/asics/collections/other';

export class AsicSummaryResponseDto {
  hostname!: string;
  ip!: string;
  avgHashRate?: number;
  maxChipTemp?: number;
  powerConsumption?: number;
  avgFanSpeed?: number;
  currentPreset?: string;
  status!: {
    state?: AsicMinerState;
    stateTimeDays?: number;
    stateTimeHours?: number;
    stateTimeMinutes?: number;
  };
}
