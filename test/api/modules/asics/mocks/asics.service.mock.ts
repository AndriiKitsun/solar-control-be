import { AsicsApiService } from '@api/modules/asics/asics.service';
import {
  AsicInfo,
  AsicUnlockSuccess,
  AsicSummary,
  AsicSummaryStats,
} from '@api/modules/asics/asics.types';
import { ClassMockWithout } from '@common/types/test.types';
import { HttpClientService } from '@api/common';
import { Maybe } from '@common/types';

export class AsicsApiServiceMock
  implements ClassMockWithout<AsicsApiService, HttpClientService>
{
  static readonly loginResponseMock: AsicUnlockSuccess = {
    token: '123',
  };

  static readonly asicSummaryMock = {
    miner_status: {
      miner_state: 'mining',
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

  static readonly asicSummaryStats: AsicSummaryStats = {
    miner: this.asicSummaryMock,
  };

  async login(ip: string, password: string): Promise<AsicUnlockSuccess> {
    return AsicsApiServiceMock.loginResponseMock;
  }

  async start(ip: string, token: string): Promise<void> {
    return;
  }

  async stop(ip: string, token: string): Promise<void> {
    return;
  }

  async getInfo(ip: string): Promise<AsicInfo> {
    return {
      hr_measure: 'MH/s',
      install_type: 'sd',
      platform: 'xil',
      build_time: '',
      fw_name: '',
      fw_version: '',
      miner: '',
      model: '',
      system: undefined,
    };
  }

  async getSummary(ip: string): Promise<Maybe<AsicSummary>> {
    return AsicsApiServiceMock.asicSummaryMock;
  }
}
