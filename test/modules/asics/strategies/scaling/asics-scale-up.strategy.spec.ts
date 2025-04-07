import { Test } from '@nestjs/testing';
import { AsicsService } from '@modules/asics/asics.service';
import { AsicsScaleUpStrategy } from '@modules/asics/strategies/scaling/asics-scale-up.strategy';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  AsicsApiService,
  AsicPerfSummary,
  AsicStatus,
  AsicSetting,
} from '@api/modules';
import { AsicsApiServiceMock } from '@api/modules/asics/mocks/asics.service.mock';
import { AsicsServiceMock } from '../../mocks/asics.service.mock';
import { Asic } from '@modules/asics/entities';
import { LoggerServiceMock } from '@common/mocks/logger.service.mock';
import { Sensor } from '@modules/sensors/entities';
import { ControlRule } from '@modules/automation/control-rule/entities';
import { ControlRuleId } from '@modules/automation/control-rule/enums';
import { SensorId } from '@modules/sensors/enums';
import { delay } from '@common/utils';
import { ASIC_START_IDLE_TIME } from '@modules/asics/asics.constants';
import { Cache } from 'cache-manager';
import { SENSORS_DATA_CACHE } from '@modules/sensors/sensors.constants';
import { AsicsRepositoryMock } from '../../mocks/asics.repository.mock';

jest.mock('@common/utils', () => ({
  decrypt: jest.fn(() => 'password'),
  delay: jest.fn(),
}));

describe('AsicsScaleUpStrategy', () => {
  let strategy: AsicsScaleUpStrategy;
  let cache: Cache;
  let asicsApiService: AsicsApiService;

  const {
    tokenMock,
    asicUntunedPresetMock,
    asicTunedPreset1Mock,
    asicTunedPreset2Mock,
    asicSettingSaveResultMock,
    asicPerfSummaryMock,
  } = AsicsApiServiceMock;
  const { asicMock, asicsMock } = AsicsRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsScaleUpStrategy,
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

    module.useLogger(new LoggerServiceMock());

    strategy = module.get(AsicsScaleUpStrategy);
    cache = module.get(CACHE_MANAGER);
    asicsApiService = module.get(AsicsApiService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('run', () => {
    const ruleMock: ControlRule = {
      id: ControlRuleId.DC_BATTERY_AVG_VOLTAGE,
      scaleUpValue: 100,
      scaleUpCheckTime: 180,
      scaleDownValue: 80,
      scaleDownCheckTime: 120,
    };
    const sensorMock = {
      sensors: [
        {
          name: SensorId.DC_BATTERY,
          avgVoltage: 110,
        },
      ],
    } as Sensor;

    let getSpy: jest.SpiedFunction<Cache['get']>;
    let shouldScaleSpy: jest.SpiedFunction<AsicsScaleUpStrategy['shouldScale']>;
    let getStatusSpy: jest.SpiedFunction<AsicsApiService['getStatus']>;

    let findFirstStoppedAsicSpy: jest.SpiedFunction<
      AsicsScaleUpStrategy['findFirstStoppedAsic']
    >;
    let startAsicOnFirstPresetSpy: jest.SpiedFunction<
      AsicsScaleUpStrategy['startAsicOnFirstPreset']
    >;

    let findAsicWithSmallestPresetSpy: jest.SpiedFunction<
      AsicsScaleUpStrategy['findAsicWithSmallestPreset']
    >;
    let incrementAsicPresetSpy: jest.SpiedFunction<
      AsicsScaleUpStrategy['incrementAsicPreset']
    >;

    beforeEach(() => {
      getSpy = jest.spyOn(cache, 'get');
      shouldScaleSpy = jest.spyOn(strategy, 'shouldScale');
      getStatusSpy = jest.spyOn(asicsApiService, 'getStatus');

      findFirstStoppedAsicSpy = jest.spyOn(strategy, 'findFirstStoppedAsic');
      startAsicOnFirstPresetSpy = jest.spyOn(
        strategy,
        'startAsicOnFirstPreset',
      );

      findAsicWithSmallestPresetSpy = jest.spyOn(
        strategy,
        'findAsicWithSmallestPreset',
      );
      incrementAsicPresetSpy = jest.spyOn(strategy, 'incrementAsicPreset');

      startAsicOnFirstPresetSpy.mockImplementation();
      incrementAsicPresetSpy.mockImplementation();
    });

    it('should return where no saved sensors data', async () => {
      await strategy.run(ruleMock);

      expect(getSpy).toHaveBeenCalledWith(SENSORS_DATA_CACHE);

      expect(shouldScaleSpy).not.toHaveBeenCalled();
    });

    it('should return when sensors data prevent scaling', async () => {
      const sensorMock = {
        sensors: [
          {
            name: SensorId.DC_BATTERY,
            avgVoltage: 90,
          },
        ],
      } as Sensor;

      await cache.set(SENSORS_DATA_CACHE, sensorMock);

      await strategy.run(ruleMock);

      expect(shouldScaleSpy).toHaveBeenCalledWith(sensorMock, ruleMock);
    });

    it('should scale by starting stopped asic', async () => {
      const statusMock = { miner_state: 'stopped' } as AsicStatus;

      getStatusSpy.mockResolvedValueOnce(statusMock);

      await cache.set(SENSORS_DATA_CACHE, sensorMock);

      await strategy.run(ruleMock);

      expect(findFirstStoppedAsicSpy).toHaveBeenCalledWith(asicsMock);
      expect(startAsicOnFirstPresetSpy).toHaveBeenCalledWith(asicMock);

      expect(findAsicWithSmallestPresetSpy).not.toHaveBeenCalled();
    });

    it('should scale by incrementing asic preset', async () => {
      await cache.set(SENSORS_DATA_CACHE, sensorMock);

      await strategy.run(ruleMock);

      expect(findAsicWithSmallestPresetSpy).toHaveBeenCalledWith(asicsMock);
      expect(incrementAsicPresetSpy).toHaveBeenCalledWith(
        asicMock,
        asicPerfSummaryMock,
      );

      expect(startAsicOnFirstPresetSpy).not.toHaveBeenCalled();
    });
  });

  describe('shouldScale', () => {
    it('should return false when rule is not related to dc battery sensor', () => {
      const sensorMock = {} as Sensor;
      const ruleMock = { id: 'someRule' } as unknown as ControlRule;

      const result = strategy.shouldScale(sensorMock, ruleMock);

      expect(result).toBe(false);
    });

    it('should return false when no dc battery sensor data', () => {
      const sensorMock = { sensors: [] } as unknown as Sensor;
      const ruleMock = {
        id: ControlRuleId.DC_BATTERY_AVG_VOLTAGE,
        scaleUpValue: 123,
      } as ControlRule;

      const result = strategy.shouldScale(sensorMock, ruleMock);

      expect(result).toBe(false);
    });

    it('should return false when no scale up value specified', () => {
      const sensorMock = {
        sensors: [{ name: SensorId.DC_BATTERY }],
      } as unknown as Sensor;
      const ruleMock = {
        id: ControlRuleId.DC_BATTERY_AVG_VOLTAGE,
      } as ControlRule;

      const result = strategy.shouldScale(sensorMock, ruleMock);

      expect(result).toBe(false);
    });

    it('should return false when dc avg voltage is less than scale up value', () => {
      const sensorMock = {
        sensors: [{ name: SensorId.DC_BATTERY, avgVoltage: 123 }],
      } as unknown as Sensor;
      const ruleMock = {
        id: ControlRuleId.DC_BATTERY_AVG_VOLTAGE,
        scaleUpValue: 150,
      } as ControlRule;

      const result = strategy.shouldScale(sensorMock, ruleMock);

      expect(result).toBe(false);
    });

    it('should return true when dc avg voltage is more than scale up value', () => {
      const sensorMock = {
        sensors: [{ name: SensorId.DC_BATTERY, avgVoltage: 200 }],
      } as unknown as Sensor;
      const ruleMock = {
        id: ControlRuleId.DC_BATTERY_AVG_VOLTAGE,
        scaleUpValue: 150,
      } as ControlRule;

      const result = strategy.shouldScale(sensorMock, ruleMock);

      expect(result).toBe(true);
    });
  });

  describe('findFirstStoppedAsic', () => {
    let getStatusSpy: jest.SpiedFunction<AsicsApiService['getStatus']>;

    beforeEach(() => {
      getStatusSpy = jest.spyOn(asicsApiService, 'getStatus');
    });

    it('should return first asic with stopped status', async () => {
      const asic1Mock = { ip: '1' };
      const asic2Mock = { ip: '2' };
      const asic3Mock = { ip: '3' };
      const asic4Mock = { ip: '4' };
      const asicsMock = [asic1Mock, asic2Mock, asic3Mock, asic4Mock] as Asic[];

      const asic1Status = {
        miner_state: 'mining',
      } as AsicStatus;
      const asic3Status = {
        miner_state: 'stopped',
      } as AsicStatus;
      const asic4Status = {
        miner_state: 'stopped',
      } as AsicStatus;

      getStatusSpy
        .mockResolvedValueOnce(asic1Status)
        .mockRejectedValueOnce(new Error('error'))
        .mockResolvedValueOnce(asic3Status)
        .mockResolvedValueOnce(asic4Status);

      const result = await strategy.findFirstStoppedAsic(asicsMock);

      expect(getStatusSpy).toHaveBeenNthCalledWith(1, asic1Mock.ip);
      expect(getStatusSpy).toHaveBeenNthCalledWith(2, asic2Mock.ip);
      expect(getStatusSpy).toHaveBeenNthCalledWith(3, asic3Mock.ip);
      expect(getStatusSpy).toHaveBeenNthCalledWith(4, asic4Mock.ip);

      expect(result).toEqual(asic3Mock);
    });

    it('should return undefined when no stopped asics', async () => {
      const asic1Mock = { ip: '1' };
      const asic2Mock = { ip: '2' };
      const asicsMock = [asic1Mock, asic2Mock] as Asic[];

      const asic1Status = {
        miner_state: 'initializing',
      } as AsicStatus;

      getStatusSpy
        .mockResolvedValueOnce(asic1Status)
        .mockRejectedValueOnce(new Error('error'));

      const result = await strategy.findFirstStoppedAsic(asicsMock);

      expect(getStatusSpy).toHaveBeenNthCalledWith(1, asic1Mock.ip);
      expect(getStatusSpy).toHaveBeenNthCalledWith(2, asic2Mock.ip);

      expect(result).toBeUndefined();
    });
  });

  describe('findAsicWithSmallestPreset', () => {
    let getPerfSummarySpy: jest.SpiedFunction<
      AsicsApiService['getPerfSummary']
    >;

    beforeEach(() => {
      getPerfSummarySpy = jest.spyOn(asicsApiService, 'getPerfSummary');
    });

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

      const result = await strategy.findAsicWithSmallestPreset(asicsMock);

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

      const result = await strategy.findAsicWithSmallestPreset(asicsMock);

      expect(result.asic).toEqual(asic1Mock);
      expect(result.perfSummary).toEqual(asic1PerfSummaryMock);
    });

    it('should return undefined when perf summary is not provided', async () => {
      const asic1Mock = { ip: '1' };
      const asicsMock = [asic1Mock] as Asic[];

      getPerfSummarySpy.mockResolvedValueOnce(undefined);

      const result = await strategy.findAsicWithSmallestPreset(asicsMock);

      expect(result.asic).toBeUndefined();
      expect(result.perfSummary).toBeUndefined();
    });
  });

  describe('startAsicOnFirstPreset', () => {
    const asicMock = { ip: 'ip', password: 'hash' } as Asic;

    let loginSpy: jest.SpiedFunction<AsicsApiService['login']>;
    let startSpy: jest.SpiedFunction<AsicsApiService['start']>;
    let getPresetsSpy: jest.SpiedFunction<AsicsApiService['getPresets']>;
    let changePresetSpy: jest.SpiedFunction<
      AsicsScaleUpStrategy['changePreset']
    >;

    beforeEach(() => {
      loginSpy = jest.spyOn(asicsApiService, 'login');
      startSpy = jest.spyOn(asicsApiService, 'start');
      getPresetsSpy = jest.spyOn(asicsApiService, 'getPresets');
      changePresetSpy = jest.spyOn(strategy, 'changePreset');

      changePresetSpy.mockImplementation();
    });

    it('should start asic and set delay', async () => {
      await strategy.startAsicOnFirstPreset(asicMock);

      expect(loginSpy).toHaveBeenCalledWith(asicMock.ip, 'password');
      expect(startSpy).toHaveBeenCalledWith(asicMock.ip, tokenMock);
      expect(delay).toHaveBeenCalledWith(ASIC_START_IDLE_TIME);
      expect(getPresetsSpy).toHaveBeenCalledWith(asicMock.ip, tokenMock);
    });

    it('should not change preset when no first autotuned preset', async () => {
      getPresetsSpy.mockResolvedValueOnce([asicUntunedPresetMock]);

      await strategy.startAsicOnFirstPreset(asicMock);

      expect(changePresetSpy).not.toHaveBeenCalled();
    });

    it('should change preset using first autotuned preset', async () => {
      await strategy.startAsicOnFirstPreset(asicMock);

      expect(changePresetSpy).toHaveBeenCalledWith(
        asicMock.ip,
        tokenMock,
        asicTunedPreset1Mock,
      );
    });
  });

  describe('incrementAsicPreset', () => {
    const asicMock = { ip: 'ip', password: 'hash' } as Asic;

    let loginSpy: jest.SpiedFunction<AsicsApiService['login']>;
    let getPresetsSpy: jest.SpiedFunction<AsicsApiService['getPresets']>;
    let changePresetSpy: jest.SpiedFunction<
      AsicsScaleUpStrategy['changePreset']
    >;

    beforeEach(() => {
      loginSpy = jest.spyOn(asicsApiService, 'login');
      getPresetsSpy = jest.spyOn(asicsApiService, 'getPresets');
      changePresetSpy = jest.spyOn(strategy, 'changePreset');

      changePresetSpy.mockImplementation();
    });

    it('should login asic and request presets', async () => {
      const perfSummaryMock = {} as AsicPerfSummary;

      await strategy.incrementAsicPreset(asicMock, perfSummaryMock);

      expect(loginSpy).toHaveBeenCalledWith(asicMock.ip, 'password');
      expect(getPresetsSpy).toHaveBeenCalledWith(asicMock.ip, tokenMock);
    });

    it('should not change preset when active preset not found', async () => {
      const perfSummaryMock = {
        current_preset: { name: 'kekw' },
      } as AsicPerfSummary;

      await strategy.incrementAsicPreset(asicMock, perfSummaryMock);

      expect(changePresetSpy).not.toHaveBeenCalled();
    });

    it('should not change preset when active preset is latest one', async () => {
      const perfSummaryMock = {
        current_preset: { name: asicTunedPreset2Mock.name },
      } as AsicPerfSummary;

      await strategy.incrementAsicPreset(asicMock, perfSummaryMock);

      expect(changePresetSpy).not.toHaveBeenCalled();
    });

    it('should change preset using next tuned preset', async () => {
      const perfSummaryMock = {
        current_preset: { name: asicTunedPreset1Mock.name },
      } as AsicPerfSummary;

      await strategy.incrementAsicPreset(asicMock, perfSummaryMock);

      expect(changePresetSpy).toHaveBeenCalledWith(
        asicMock.ip,
        tokenMock,
        asicTunedPreset2Mock,
      );
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
