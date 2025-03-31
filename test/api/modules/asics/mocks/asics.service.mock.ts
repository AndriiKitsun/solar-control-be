import { AsicsApiService } from '@api/modules/asics/asics.service';
import {
  AsicInfo,
  AsicUnlockSuccess,
  AsicSummary,
  AsicSummaryStats,
  AsicPerfSummary,
  AsicPreset,
  AsicStatus,
} from '@api/modules/asics/asics.types';
import { ClassMockWithout } from '@common/types/test.types';
import { Maybe } from '@common/types';
import { AbstractHttpService } from '@api/services';

export class AsicsApiServiceMock
  implements ClassMockWithout<AsicsApiService, AbstractHttpService>
{
  static readonly loginResponseMock: AsicUnlockSuccess = {
    token: '123',
  };

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

  static readonly asicPerfSummaryMock = {
    current_preset: {
      name: '3200',
      pretty: '3200W ~ 65 TH',
    },
  } as AsicPerfSummary;

  static readonly asicSummaryStats: AsicSummaryStats = {
    miner: this.asicSummaryMock,
  };

  static readonly asicStatus: AsicStatus = {
    miner_state: 'mining',
    miner_state_time: 52,
    find_miner: false,
    restart_required: false,
    reboot_required: false,
    unlocked: false,
  };

  async login(ip: string, password: string): Promise<string> {
    return AsicsApiServiceMock.loginResponseMock.token;
  }

  async start(ip: string, token: string): Promise<void> {
    return;
  }

  async stop(ip: string, token: string): Promise<void> {
    return;
  }

  async getInfo(ip: string): Promise<AsicInfo> {
    return {
      serial: '',
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

  async getPerfSummary(ip: string): Promise<Maybe<AsicPerfSummary>> {
    return AsicsApiServiceMock.asicPerfSummaryMock;
  }

  async getPresets(ip: string, token: string): Promise<AsicPreset[]> {
    return [];
  }

  async getStatus(ip: string): Promise<AsicStatus> {
    return AsicsApiServiceMock.asicStatus;
  }
}
