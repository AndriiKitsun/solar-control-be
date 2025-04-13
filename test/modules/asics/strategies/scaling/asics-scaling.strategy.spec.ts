import { Test } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ControlRule } from '@modules/automation/control-rule/entities';
import { Cache } from 'cache-manager';
import { AsicsScalingStrategy } from '@modules/asics/strategies/scaling/asics-scaling.strategy';
import { Injectable, Inject } from '@nestjs/common';
import { Asic } from '@modules/asics/entities';
import { ControlRuleRepositoryMock } from '../../../automation/control-rule/mocks/control-rule.repository.mock';
import { AsicsRepository } from '@modules/asics/asics.repository';
import { AsicsRepositoryMock } from '../../mocks/asics.repository.mock';
import { AsicsApiFacade } from '@api/modules/asics/services/asics-api.facade';
import { AsicsApiFacadeMock } from '@api/modules/asics/services/mocks/asics-api.facade.mock';
import { AsicsAuthApiServiceMock } from '@api/modules/asics/collections/auth/mocks/auth.service.mock';
import { AsicsAutotuneApiServiceMock } from '@api/modules/asics/collections/autotune/mocks/autotune.service.mock';
import { AsicsSettingsApiServiceMock } from '@api/modules/asics/collections/settings/mocks/settings.service.mock';
import { AsicPerfSummary, AsicSetting } from '@api/modules/asics';
import {
  EspSensorsData,
  EspSensorId,
  ESP_SENSORS_CACHE,
} from '@api/modules/esp';
import { LogsService } from '@modules/logs/logs.service';
import { LogsServiceMock } from '../../../logs/mocks/logs.service.mock';

@Injectable()
class AsicsScalingStrategyMock extends AsicsScalingStrategy {
  constructor(
    @Inject(CACHE_MANAGER)
    protected override readonly cache: Cache,
    protected override readonly asicsRepository: AsicsRepository,
    protected override readonly asicsApiFacade: AsicsApiFacade,
    protected override readonly logsService: LogsService,
  ) {
    super(cache, asicsRepository, asicsApiFacade, logsService);
  }

  scale(): Promise<void> {
    return Promise.resolve();
  }

  shouldScale(sensor: EspSensorsData, rule: ControlRule): boolean {
    return false;
  }
}

describe('AsicsScaleStrategy', () => {
  let strategy: AsicsScalingStrategyMock;
  let cache: Cache;
  let asicsRepository: AsicsRepository;
  let asicsApiFacade: AsicsApiFacade;
  let logsService: LogsService;

  const { controlRuleMock } = ControlRuleRepositoryMock;
  const { tokenMock } = AsicsAuthApiServiceMock;
  const { asicTunedPreset1Mock } = AsicsAutotuneApiServiceMock;
  const { asicSettingSaveResultMock } = AsicsSettingsApiServiceMock;
  const { asicsMock } = AsicsRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsScalingStrategyMock,
        {
          provide: CACHE_MANAGER,
          useClass: Map,
        },
        {
          provide: AsicsRepository,
          useClass: AsicsRepositoryMock,
        },
        {
          provide: AsicsApiFacade,
          useClass: AsicsApiFacadeMock,
        },
        {
          provide: LogsService,
          useClass: LogsServiceMock,
        },
      ],
    }).compile();

    strategy = module.get(AsicsScalingStrategyMock);
    cache = module.get(CACHE_MANAGER);
    asicsRepository = module.get(AsicsRepository);
    asicsApiFacade = module.get(AsicsApiFacade);
    logsService = module.get(LogsService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('run', () => {
    const sensorMock = {
      sensors: [
        {
          name: EspSensorId.DC_BATTERY,
          avgVoltage: 110,
        },
      ],
    } as EspSensorsData;

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

      expect(getSpy).toHaveBeenCalledWith(ESP_SENSORS_CACHE);

      expect(shouldScaleSpy).not.toHaveBeenCalled();
    });

    it('should return when sensors data prevent scaling', async () => {
      await cache.set(ESP_SENSORS_CACHE, sensorMock);

      await strategy.run(controlRuleMock);

      expect(shouldScaleSpy).toHaveBeenCalledWith(sensorMock, controlRuleMock);
    });

    it('should fetch list of automated asics', async () => {
      const findWhereSpy = jest.spyOn(asicsRepository, 'findWhere');

      shouldScaleSpy.mockReturnValueOnce(true);
      await cache.set(ESP_SENSORS_CACHE, sensorMock);

      await strategy.run(controlRuleMock);

      expect(findWhereSpy).toHaveBeenCalledWith({ automated: true });

      expect(strategy.asics).toBe(asicsMock);
    });

    it('should execute scaling method', async () => {
      const scaleSpy = jest.spyOn(strategy, 'scale');

      shouldScaleSpy.mockReturnValueOnce(true);
      await cache.set(ESP_SENSORS_CACHE, sensorMock);

      await strategy.run(controlRuleMock);

      expect(scaleSpy).toHaveBeenCalled();
    });

    it('should create log in case when error occurred', async () => {
      const errorSpy = jest.spyOn(logsService, 'error');

      jest.spyOn(strategy, 'scale').mockRejectedValueOnce(new Error('error'));

      shouldScaleSpy.mockReturnValueOnce(true);
      await cache.set(ESP_SENSORS_CACHE, sensorMock);

      await strategy.run(controlRuleMock);

      expect(errorSpy).toHaveBeenCalled();
    });
  });

  describe('findAsicWithPreset', () => {
    let getPerfSummarySpy: jest.SpiedFunction<AsicsApiFacade['getPerfSummary']>;

    beforeEach(() => {
      getPerfSummarySpy = jest.spyOn(asicsApiFacade, 'getPerfSummary');
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
        const asicsMock = [
          asic1Mock,
          asic2Mock,
          asic3Mock,
          asic4Mock,
        ] as Asic[];

        const asic1PerfSummaryMock = {
          current_preset: { name: '2300' },
        } as AsicPerfSummary;
        const asic3PerfSummaryMock = {
          current_preset: { name: '1500' },
        } as AsicPerfSummary;
        const asic4PerfSummaryMock = {
          current_preset: { name: '3200' },
        } as AsicPerfSummary;

        getPerfSummarySpy
          .mockResolvedValueOnce(asic1PerfSummaryMock)
          .mockRejectedValueOnce(new Error('error'))
          .mockResolvedValueOnce(asic3PerfSummaryMock)
          .mockResolvedValueOnce(asic4PerfSummaryMock);

        const result = await strategy.findAsicWithPreset(
          asicsMock,
          presetPredicate,
        );

        expect(getPerfSummarySpy).toHaveBeenNthCalledWith(1, asic1Mock.ip);
        expect(getPerfSummarySpy).toHaveBeenNthCalledWith(2, asic2Mock.ip);
        expect(getPerfSummarySpy).toHaveBeenNthCalledWith(3, asic3Mock.ip);
        expect(getPerfSummarySpy).toHaveBeenNthCalledWith(4, asic4Mock.ip);

        expect(result.asic).toEqual(asic3Mock);
        expect(result.perfSummary).toEqual(asic3PerfSummaryMock);
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

        getPerfSummarySpy.mockRejectedValueOnce(new Error('error'));

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
        const asicsMock = [
          asic1Mock,
          asic2Mock,
          asic3Mock,
          asic4Mock,
        ] as Asic[];

        const asic1PerfSummaryMock = {
          current_preset: { name: '2300' },
        } as AsicPerfSummary;
        const asic3PerfSummaryMock = {
          current_preset: { name: '1500' },
        } as AsicPerfSummary;
        const asic4PerfSummaryMock = {
          current_preset: { name: '3200' },
        } as AsicPerfSummary;

        getPerfSummarySpy
          .mockResolvedValueOnce(asic1PerfSummaryMock)
          .mockRejectedValueOnce(new Error('error'))
          .mockResolvedValueOnce(asic3PerfSummaryMock)
          .mockResolvedValueOnce(asic4PerfSummaryMock);

        const result = await strategy.findAsicWithPreset(
          asicsMock,
          presetPredicate,
        );

        expect(getPerfSummarySpy).toHaveBeenNthCalledWith(1, asic1Mock.ip);
        expect(getPerfSummarySpy).toHaveBeenNthCalledWith(2, asic2Mock.ip);
        expect(getPerfSummarySpy).toHaveBeenNthCalledWith(3, asic3Mock.ip);
        expect(getPerfSummarySpy).toHaveBeenNthCalledWith(4, asic4Mock.ip);

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

        getPerfSummarySpy.mockRejectedValueOnce(new Error('error'));

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
              volt: 1477,
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

      const getSettingsSpy = jest.spyOn(asicsApiFacade, 'getSettings');
      const saveSettingsSpy = jest.spyOn(asicsApiFacade, 'saveSettings');

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
