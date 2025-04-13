import { ClassMock } from '@common/types/test.types';
import { AsicsAutotuneApiService, AsicPreset } from '@api/modules/asics';

export class AsicsAutotuneApiServiceMock
  implements ClassMock<AsicsAutotuneApiService>
{
  static readonly asicTunedPreset1Mock: AsicPreset = {
    name: '1500',
    pretty: '1500 watt ~ 64 TH',
    status: 'tuned',
    modded_psu_required: false,
    tune_settings: {
      hashrate: 66407,
      volt: 14765,
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

  async getPresets(ip: string, token: string): Promise<AsicPreset[]> {
    return AsicsAutotuneApiServiceMock.asicPresetsMock;
  }
}
