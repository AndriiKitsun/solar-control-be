import { Injectable } from '@nestjs/common';
import { Maybe } from '@common/types';
import {
  AsicsAuthApiService,
  AsicsAutotuneApiService,
  AsicsMiningApiService,
  AsicsOtherApiService,
  AsicsSettingsApiService,
  AsicPreset,
  AsicStatus,
  AsicInfo,
  AsicSummary,
  AsicPerfSummary,
  AsicsSettings,
  AsicSetting,
  AsicSettingSaveResult,
} from '../collections';

@Injectable()
export class AsicsApiFacade {
  constructor(
    private readonly authApiService: AsicsAuthApiService,
    private readonly autotuneApiService: AsicsAutotuneApiService,
    private readonly miningApiService: AsicsMiningApiService,
    private readonly otherApiService: AsicsOtherApiService,
    private readonly settingsApiService: AsicsSettingsApiService,
  ) {}

  async login(ip: string, password: string): Promise<string> {
    const response = await this.authApiService.login(ip, password);

    return response.token;
  }

  getPresets(ip: string, token: string): Promise<AsicPreset[]> {
    return this.autotuneApiService.getPresets(ip, token);
  }

  start(ip: string, token: string): Promise<void> {
    return this.miningApiService.start(ip, token);
  }

  stop(ip: string, token: string): Promise<void> {
    return this.miningApiService.stop(ip, token);
  }

  getStatus(ip: string): Promise<AsicStatus> {
    return this.otherApiService.getStatus(ip);
  }

  getInfo(ip: string): Promise<AsicInfo> {
    return this.otherApiService.getInfo(ip);
  }

  async getSummary(ip: string): Promise<Maybe<AsicSummary>> {
    const response = await this.otherApiService.getSummary(ip);

    return response.miner;
  }

  getPerfSummary(ip: string): Promise<AsicPerfSummary> {
    return this.otherApiService.getPerfSummary(ip);
  }

  getSettings(ip: string, token: string): Promise<AsicsSettings> {
    return this.settingsApiService.getSettings(ip, token);
  }

  saveSettings(
    ip: string,
    token: string,
    setting: AsicSetting,
  ): Promise<AsicSettingSaveResult> {
    return this.settingsApiService.saveSettings(ip, token, setting);
  }

  // async login(ip: string, password: string): Promise<string> {
  //   return '';
  // }
  //
  // async getPresets(ip: string, token: string): Promise<AsicPreset[]> {
  //   return [];
  // }
  //
  // async start(ip: string, token: string): Promise<void> {
  //   return;
  // }
  //
  // async stop(ip: string, token: string): Promise<void> {
  //   return;
  // }

  // async getStatus(ip: string): Promise<AsicStatus> {
  //   return {
  //     description: undefined,
  //     find_miner: false,
  //     miner_state: 'mining',
  //     miner_state_time: 0,
  //     reboot_required: false,
  //     restart_required: false,
  //     unlock_timeout: undefined,
  //     unlocked: false,
  //     warranty: undefined,
  //   };
  // }

  // async getInfo(ip: string): Promise<AsicInfo> {
  //   return {
  //     build_name: '',
  //     build_time: '',
  //     build_uuid: '',
  //     fw_name: '',
  //     fw_version: '',
  //     hr_measure: 'MH/s',
  //     install_type: 'sd',
  //     miner: '',
  //     model: '',
  //     platform: 'aml',
  //     serial: '',
  //     system: undefined,
  //   };
  // }
  //
  // async getSummary(ip: string): Promise<Maybe<AsicSummary>> {
  //   return;
  // }
  //
  // async getPerfSummary(ip: string): Promise<AsicPerfSummary> {
  //   return AsicsApiServiceMock.asicPerfSummaryMock;
  // }
  //
  // async getSettings(ip: string, token: string): Promise<AsicsSettings> {
  //   return AsicsApiServiceMock.asicSettingsMock;
  // }
  //
  // async saveSettings(
  //   ip: string,
  //   token: string,
  //   setting: AsicSetting,
  // ): Promise<AsicSettingSaveResult> {
  //   return AsicsApiServiceMock.asicSettingSaveResultMock;
  // }
}
