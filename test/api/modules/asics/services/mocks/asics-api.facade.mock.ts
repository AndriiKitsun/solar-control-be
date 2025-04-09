import { ClassMock } from '@common/types/test.types';
import {
  AsicsApiFacade,
  AsicSetting,
  AsicInfo,
  AsicPerfSummary,
  AsicPreset,
  AsicsSettings,
  AsicStatus,
  AsicSummary,
  AsicSettingSaveResult,
} from '@api/modules/asics';
import { Maybe } from '@common/types';
import { AsicsAuthApiServiceMock } from '../../collections/auth/mocks/auth.service.mock';
import { AsicsAutotuneApiServiceMock } from '../../collections/autotune/mocks/autotune.service.mock';
import { AsicsOtherApiServiceMock } from '../../collections/other/mocks/other.service.mock';
import { AsicsSettingsApiServiceMock } from '../../collections/settings/mocks/settings.service.mock';

export class AsicsApiFacadeMock implements ClassMock<AsicsApiFacade> {
  async login(ip: string, password: string): Promise<string> {
    return AsicsAuthApiServiceMock.tokenMock;
  }

  async getPresets(ip: string, token: string): Promise<AsicPreset[]> {
    return AsicsAutotuneApiServiceMock.asicPresetsMock;
  }

  async start(ip: string, token: string): Promise<void> {
    return;
  }

  async stop(ip: string, token: string): Promise<void> {
    return;
  }

  async getStatus(ip: string): Promise<AsicStatus> {
    return AsicsOtherApiServiceMock.asicStatusMock;
  }

  async getInfo(ip: string): Promise<AsicInfo> {
    return AsicsOtherApiServiceMock.asicInfoMock;
  }

  async getSummary(ip: string): Promise<Maybe<AsicSummary>> {
    return AsicsOtherApiServiceMock.asicSummaryMock;
  }

  async getPerfSummary(ip: string): Promise<AsicPerfSummary> {
    return AsicsOtherApiServiceMock.asicPerfSummaryMock;
  }

  async getSettings(ip: string, token: string): Promise<AsicsSettings> {
    return AsicsSettingsApiServiceMock.asicSettingsMock;
  }

  async saveSettings(
    ip: string,
    token: string,
    setting: AsicSetting,
  ): Promise<AsicSettingSaveResult> {
    return AsicsSettingsApiServiceMock.asicSettingSaveResultMock;
  }
}
