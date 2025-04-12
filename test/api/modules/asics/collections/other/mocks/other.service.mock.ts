import { ClassMock } from '@common/types/test.types';
import {
  AsicsOtherApiService,
  AsicInfo,
  AsicPerfSummary,
  AsicStatus,
  AsicSummaryStats,
  AsicSummary,
} from '@api/modules/asics';

export class AsicsOtherApiServiceMock
  implements ClassMock<AsicsOtherApiService>
{
  static readonly asicStatusMock: AsicStatus = {
    miner_state: 'mining',
    miner_state_time: 52,
    find_miner: false,
    restart_required: false,
    reboot_required: false,
    unlocked: false,
  };

  static readonly asicInfoMock = {
    system: {
      network_status: {
        hostname: 'hostname',
      },
    },
  } as AsicInfo;

  static readonly asicSummaryMock = {
    miner_status: {
      miner_state: 'mining',
      miner_state_time: 123,
    },
    average_hashrate: 66.34,
    chip_temp: {
      max: 60,
    },
    power_consumption: 690,
    cooling: {
      fan_duty: 55,
    },
  } as AsicSummary;

  static readonly asicSummaryStatsMock: AsicSummaryStats = {
    miner: this.asicSummaryMock,
  };

  static readonly asicPerfSummaryMock = {
    current_preset: {
      name: '3200',
      pretty: '3200W ~ 65 TH',
    },
  } as AsicPerfSummary;

  async getStatus(ip: string): Promise<AsicStatus> {
    return AsicsOtherApiServiceMock.asicStatusMock;
  }

  async getInfo(ip: string): Promise<AsicInfo> {
    return AsicsOtherApiServiceMock.asicInfoMock;
  }

  async getSummary(ip: string): Promise<AsicSummaryStats> {
    return AsicsOtherApiServiceMock.asicSummaryStatsMock;
  }

  async getPerfSummary(ip: string): Promise<AsicPerfSummary> {
    return AsicsOtherApiServiceMock.asicPerfSummaryMock;
  }
}
