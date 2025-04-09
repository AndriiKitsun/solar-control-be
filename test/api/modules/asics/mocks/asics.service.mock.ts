import { AsicUnlockSuccess } from '@api/modules/asics/collections/auth';
import {
  AsicSummary,
  AsicPerfSummary,
  AsicSummaryStats,
  AsicStatus,
  AsicInfo,
} from '@api/modules/asics/collections/other';
import { AsicPreset } from '@api/modules/asics/collections/autotune';
import {
  AsicsSettings,
  AsicSettingSaveResult,
} from '@api/modules/asics/collections/settings';

export class AsicsApiServiceMock {
  static readonly tokenMock = 'token';
  static readonly loginResponseMock: AsicUnlockSuccess = {
    token: this.tokenMock,
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

  static readonly asicSummaryStatsMock: AsicSummaryStats = {
    miner: this.asicSummaryMock,
  };

  static readonly asicStatusMock: AsicStatus = {
    miner_state: 'mining',
    miner_state_time: 52,
    find_miner: false,
    restart_required: false,
    reboot_required: false,
    unlocked: false,
  };

  static readonly asicInfoMock: AsicInfo = {
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

  static readonly asicTunedPreset1Mock: AsicPreset = {
    name: '1500',
    pretty: '1500 watt ~ 64 TH',
    status: 'tuned',
    modded_psu_required: false,
    tune_settings: {
      hashrate: 66407,
      volt: 14150,
      freq: 485,
      chains: [
        {
          freq: 488,
          serial: 'PIEMYP7BBJHBE0X5R',
          chips: [0],
        },
        {
          freq: 488,
          serial: 'PIEMYP7BBJHBE0X59',
          chips: [0],
        },
        {
          freq: 488,
          serial: 'PIEMYP7BBJHBE0FY9',
          chips: [0],
        },
      ],
      modified: false,
    },
  };

  static readonly asicTunedPreset2Mock: AsicPreset = {
    name: '2300',
    pretty: '2300 watt ~ 76 TH',
    status: 'tuned',
    modded_psu_required: false,
    tune_settings: {
      hashrate: 75910,
      volt: 14210,
      freq: 570,
      chains: [
        {
          freq: 570,
          serial: 'PIEMYP7BBJHBE0X5R',
          chips: [564],
        },
        {
          freq: 570,
          serial: 'PIEMYP7BBJHBE0X59',
          chips: [564],
        },
        {
          freq: 564,
          serial: 'PIEMYP7BBJHBE0FY9',
          chips: [552],
        },
      ],
      modified: false,
    },
  };

  static readonly asicUntunedPresetMock: AsicPreset = {
    name: '1700',
    pretty: '1700 watt ~ 67 TH',
    status: 'untuned',
    modded_psu_required: false,
  };

  static readonly asicPresetsMock: AsicPreset[] = [
    {
      name: 'disabled',
      pretty: 'Disabled',
      status: 'untuned',
      modded_psu_required: false,
    },
    this.asicTunedPreset1Mock,
    this.asicUntunedPresetMock,
    this.asicTunedPreset2Mock,
  ];

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
}
