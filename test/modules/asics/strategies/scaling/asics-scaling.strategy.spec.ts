import { Test } from '@nestjs/testing';
import { AsicsService } from '@modules/asics/asics.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AsicsApiService, AsicSetting, AsicPerfSummary } from '@api/modules';
import { AsicsApiServiceMock } from '@api/modules/asics/mocks/asics.service.mock';
import { AsicsServiceMock } from '../../mocks/asics.service.mock';
import { Sensor } from '@modules/sensors/entities';
import { ControlRule } from '@modules/automation/control-rule/entities';
import { SensorId } from '@modules/sensors/enums';
import { Cache } from 'cache-manager';
import { SENSORS_DATA_CACHE } from '@modules/sensors/sensors.constants';
import { AsicsScalingStrategy } from '@modules/asics/strategies/scaling/asics-scaling.strategy';
import { Injectable, Inject } from '@nestjs/common';
import { Asic } from '@modules/asics/entities';
import { ControlRuleRepositoryMock } from '../../../automation/control-rule/mocks/control-rule.repository.mock';

@Injectable()
class AsicsScalingStrategyMock extends AsicsScalingStrategy {
  constructor(
    @Inject(CACHE_MANAGER)
    protected override readonly cache: Cache,
    protected override readonly asicsService: AsicsService,
    protected override readonly asicsApiService: AsicsApiService,
  ) {
    super(cache, asicsService, asicsApiService);
  }

  scale(): Promise<void> {
    return Promise.resolve();
  }

  shouldScale(sensor: Sensor, rule: ControlRule): boolean {
    return false;
  }
}

describe('AsicsScaleStrategy', () => {
  let strategy: AsicsScalingStrategyMock;
  let cache: Cache;
  let asicsApiService: AsicsApiService;

  const { controlRuleMock } = ControlRuleRepositoryMock;
  const { tokenMock, asicTunedPreset1Mock, asicSettingSaveResultMock } =
    AsicsApiServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsScalingStrategyMock,
        {
          provide: CACHE_MANAGER,
          useClass: Map,
        },
        {
          provide: AsicsService,
          useClass: AsicsServiceMock,
        },
        {
          provide: AsicsApiService,
          useClass: AsicsApiServiceMock,
        },
      ],
    }).compile();

    strategy = module.get(AsicsScalingStrategyMock);
    cache = module.get(CACHE_MANAGER);
    asicsApiService = module.get(AsicsApiService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('run', () => {
    const sensorMock = {
      sensors: [
        {
          name: SensorId.DC_BATTERY,
          avgVoltage: 110,
        },
      ],
    } as Sensor;

    let getSpy: jest.SpiedFunction<Cache['get']>;
    let shouldScaleSpy: jest.SpiedFunction<
      AsicsScalingStrategyMock['shouldScale']
    >;

    beforeEach(() => {
      getSpy = jest.spyOn(cache, 'get');
      shouldScaleSpy = jest.spyOn(strategy, 'shouldScale');
    });

    it('should return where no saved sensors data', async () => {
      await strategy.run(controlRuleMock);

      expect(getSpy).toHaveBeenCalledWith(SENSORS_DATA_CACHE);

      expect(shouldScaleSpy).not.toHaveBeenCalled();
    });

    it('should return when sensors data prevent scaling', async () => {
      await cache.set(SENSORS_DATA_CACHE, sensorMock);

      await strategy.run(controlRuleMock);

      expect(shouldScaleSpy).toHaveBeenCalledWith(sensorMock, controlRuleMock);
    });

    it('should scale by starting stopped asic', async () => {
      const scaleSpy = jest.spyOn(strategy, 'scale');

      shouldScaleSpy.mockReturnValueOnce(true);
      await cache.set(SENSORS_DATA_CACHE, sensorMock);

      await strategy.run(controlRuleMock);

      expect(scaleSpy).toHaveBeenCalled();
    });
  });

  describe('findAsicWithPreset', () => {
    let getPerfSummarySpy: jest.SpiedFunction<
      AsicsApiService['getPerfSummary']
    >;

    beforeEach(() => {
      getPerfSummarySpy = jest.spyOn(asicsApiService, 'getPerfSummary');
    });

    describe('to get asic with smallest preset', () => {
      function presetPredicate(savedPreset: string, preset: string): boolean {
        return savedPreset < preset;
      }

      it('should return asic and preset with smallest activated preset', async () => {
        const asic1Mock = { ip: '1' };
        const asic2Mock = { ip: '2' };
        const asic3Mock = { ip: '3' };
        const asic4Mock = { ip: '4' };
        const asic5Mock = { ip: '5' };
        const asicsMock = [
          asic1Mock,
          asic2Mock,
          asic3Mock,
          asic4Mock,
          asic5Mock,
        ] as Asic[];

        const asic1PerfSummaryMock = {
          current_preset: { name: '2300' },
        } as AsicPerfSummary;
        const asic4PerfSummaryMock = {
          current_preset: { name: '1500' },
        } as AsicPerfSummary;
        const asic5PerfSummaryMock = {
          current_preset: { name: '3200' },
        } as AsicPerfSummary;

        getPerfSummarySpy
          .mockResolvedValueOnce(asic1PerfSummaryMock)
          .mockResolvedValueOnce(undefined)
          .mockRejectedValueOnce(new Error('error'))
          .mockResolvedValueOnce(asic4PerfSummaryMock)
          .mockResolvedValueOnce(asic5PerfSummaryMock);

        const result = await strategy.findAsicWithPreset(
          asicsMock,
          presetPredicate,
        );

        expect(getPerfSummarySpy).toHaveBeenNthCalledWith(1, asic1Mock.ip);
        expect(getPerfSummarySpy).toHaveBeenNthCalledWith(2, asic2Mock.ip);
        expect(getPerfSummarySpy).toHaveBeenNthCalledWith(3, asic3Mock.ip);
        expect(getPerfSummarySpy).toHaveBeenNthCalledWith(4, asic4Mock.ip);
        expect(getPerfSummarySpy).toHaveBeenNthCalledWith(5, asic5Mock.ip);

        expect(result.asic).toEqual(asic4Mock);
        expect(result.perfSummary).toEqual(asic4PerfSummaryMock);
      });

      it('should return first asic when array contains only one element', async () => {
        const asic1Mock = { ip: '1' };
        const asicsMock = [asic1Mock] as Asic[];

        const asic1PerfSummaryMock = {
          current_preset: { name: '2300' },
        } as AsicPerfSummary;

        getPerfSummarySpy.mockResolvedValueOnce(asic1PerfSummaryMock);

        const result = await strategy.findAsicWithPreset(
          asicsMock,
          presetPredicate,
        );

        expect(result.asic).toEqual(asic1Mock);
        expect(result.perfSummary).toEqual(asic1PerfSummaryMock);
      });

      it('should return undefined when perf summary is not provided', async () => {
        const asic1Mock = { ip: '1' };
        const asicsMock = [asic1Mock] as Asic[];

        getPerfSummarySpy.mockResolvedValueOnce(undefined);

        const result = await strategy.findAsicWithPreset(
          asicsMock,
          presetPredicate,
        );

        expect(result.asic).toBeUndefined();
        expect(result.perfSummary).toBeUndefined();
      });
    });

    describe('to get asic with highest preset', () => {
      function presetPredicate(savedPreset: string, preset: string): boolean {
        return savedPreset > preset;
      }

      it('should return asic and preset with highest activated preset', async () => {
        const asic1Mock = { ip: '1' };
        const asic2Mock = { ip: '2' };
        const asic3Mock = { ip: '3' };
        const asic4Mock = { ip: '4' };
        const asic5Mock = { ip: '5' };
        const asicsMock = [
          asic1Mock,
          asic2Mock,
          asic3Mock,
          asic4Mock,
          asic5Mock,
        ] as Asic[];

        const asic1PerfSummaryMock = {
          current_preset: { name: '2300' },
        } as AsicPerfSummary;
        const asic4PerfSummaryMock = {
          current_preset: { name: '1500' },
        } as AsicPerfSummary;
        const asic5PerfSummaryMock = {
          current_preset: { name: '3200' },
        } as AsicPerfSummary;

        getPerfSummarySpy
          .mockResolvedValueOnce(asic1PerfSummaryMock)
          .mockResolvedValueOnce(undefined)
          .mockRejectedValueOnce(new Error('error'))
          .mockResolvedValueOnce(asic4PerfSummaryMock)
          .mockResolvedValueOnce(asic5PerfSummaryMock);

        const result = await strategy.findAsicWithPreset(
          asicsMock,
          presetPredicate,
        );

        expect(getPerfSummarySpy).toHaveBeenNthCalledWith(1, asic1Mock.ip);
        expect(getPerfSummarySpy).toHaveBeenNthCalledWith(2, asic2Mock.ip);
        expect(getPerfSummarySpy).toHaveBeenNthCalledWith(3, asic3Mock.ip);
        expect(getPerfSummarySpy).toHaveBeenNthCalledWith(4, asic4Mock.ip);
        expect(getPerfSummarySpy).toHaveBeenNthCalledWith(5, asic5Mock.ip);

        expect(result.asic).toEqual(asic5Mock);
        expect(result.perfSummary).toEqual(asic5PerfSummaryMock);
      });

      it('should return first asic when array contains only one element', async () => {
        const asic1Mock = { ip: '1' };
        const asicsMock = [asic1Mock] as Asic[];

        const asic1PerfSummaryMock = {
          current_preset: { name: '2300' },
        } as AsicPerfSummary;

        getPerfSummarySpy.mockResolvedValueOnce(asic1PerfSummaryMock);

        const result = await strategy.findAsicWithPreset(
          asicsMock,
          presetPredicate,
        );

        expect(result.asic).toEqual(asic1Mock);
        expect(result.perfSummary).toEqual(asic1PerfSummaryMock);
      });

      it('should return undefined when perf summary is not provided', async () => {
        const asic1Mock = { ip: '1' };
        const asicsMock = [asic1Mock] as Asic[];

        getPerfSummarySpy.mockResolvedValueOnce(undefined);

        const result = await strategy.findAsicWithPreset(
          asicsMock,
          presetPredicate,
        );

        expect(result.asic).toBeUndefined();
        expect(result.perfSummary).toBeUndefined();
      });
    });
  });

  describe('changePreset', () => {
    it('should build correct payload based on preset and settings data', async () => {
      const expectedSetting: AsicSetting = {
        miner: {
          overclock: {
            preset: '1500',
            modded_psu: false,
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
            globals: {
              freq: 485,
              volt: 1415,
            },
            chains: [
              {
                freq: 488,
                disabled: false,
                chips: [0],
              },
              {
                freq: 488,
                disabled: false,
                chips: [0],
              },
              {
                freq: 488,
                disabled: false,
                chips: [0],
              },
            ],
          },
        },
      };
      const ipMock = 'ip';

      const getSettingsSpy = jest.spyOn(asicsApiService, 'getSettings');
      const saveSettingsSpy = jest.spyOn(asicsApiService, 'saveSettings');

      const result = await strategy.changePreset(
        ipMock,
        tokenMock,
        asicTunedPreset1Mock,
      );

      expect(getSettingsSpy).toHaveBeenCalledWith(ipMock, tokenMock);
      expect(saveSettingsSpy).toHaveBeenCalledWith(
        ipMock,
        tokenMock,
        expectedSetting,
      );

      expect(result).toBe(asicSettingSaveResultMock);
    });
  });
});
