import { ClassMock } from '@common/types/test.types';
import {
  AsicsSettingsApiService,
  AsicsSettings,
  AsicSetting,
  AsicSettingSaveResult,
} from '@api/modules/asics';

export class AsicsSettingsApiServiceMock
  implements ClassMock<AsicsSettingsApiService>
{
  static readonly asicSettingMock: AsicSetting = {
    miner: {},
  };

  static readonly asicSettingsMock: AsicsSettings = {
    miner: {
      overclock: {
        preset_switcher: {
          enabled: false,
          top_preset: '4000',
          min_preset: '1500',
          autochange_top_preset: false,
          rise_temp: 55,
          decrease_temp: 75,
          ignore_fan_speed: false,
          check_time: 300,
        },
        chains: [
          {
            disabled: false,
          },
          {
            disabled: false,
          },
          {
            disabled: false,
          },
        ],
      },
    },
    network: {
      dhcp: false,
      dnsservers: [],
      gateway: '',
      hostname: '',
      ipaddress: '',
      netmask: '',
    },
    regional: {
      timezone: {
        current: 'GMT+2',
      },
    },
    ui: {},
  };

  static readonly asicSettingSaveResultMock: AsicSettingSaveResult = {
    reboot_required: false,
    restart_required: false,
  };

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
