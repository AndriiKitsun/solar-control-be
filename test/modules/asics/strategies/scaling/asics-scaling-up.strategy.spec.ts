import { Test } from '@nestjs/testing';
import { AsicsService } from '@modules/asics/asics.service';
import { AsicsScalingUpStrategy } from '@modules/asics/strategies/scaling/asics-scaling-up.strategy';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AsicsApiService, AsicPerfSummary, AsicStatus } from '@api/modules';
import { AsicsApiServiceMock } from '@api/modules/asics/mocks/asics.service.mock';
import { AsicsServiceMock } from '../../mocks/asics.service.mock';
import { Asic } from '@modules/asics/entities';
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

describe('AsicsScalingUpStrategy', () => {
  let strategy: AsicsScalingUpStrategy;
  let cache: Cache;
  let asicsApiService: AsicsApiService;

  const {
    tokenMock,
    asicUntunedPresetMock,
    asicTunedPreset1Mock,
    asicTunedPreset2Mock,
    asicPerfSummaryMock,
  } = AsicsApiServiceMock;
  const { asicMock, asicsMock } = AsicsRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsScalingUpStrategy,
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

    strategy = module.get(AsicsScalingUpStrategy);
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
    let shouldScaleSpy: jest.SpiedFunction<
      AsicsScalingUpStrategy['shouldScale']
    >;
    let getStatusSpy: jest.SpiedFunction<AsicsApiService['getStatus']>;

    let findFirstStoppedAsicSpy: jest.SpiedFunction<
      AsicsScalingUpStrategy['findFirstStoppedAsic']
    >;
    let startAsicOnFirstPresetSpy: jest.SpiedFunction<
      AsicsScalingUpStrategy['startAsicOnFirstPreset']
    >;

    let findAsicWithPresetSpy: jest.SpiedFunction<
      AsicsScalingUpStrategy['findAsicWithPreset']
    >;
    let incrementAsicPresetSpy: jest.SpiedFunction<
      AsicsScalingUpStrategy['incrementAsicPreset']
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

      findAsicWithPresetSpy = jest.spyOn(strategy, 'findAsicWithPreset');
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

      expect(findAsicWithPresetSpy).not.toHaveBeenCalled();
    });

    it('should scale by incrementing asic preset', async () => {
      await cache.set(SENSORS_DATA_CACHE, sensorMock);

      await strategy.run(ruleMock);

      expect(findAsicWithPresetSpy).toHaveBeenCalledWith(
        asicsMock,
        expect.any(Function),
      );
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

  describe('startAsicOnFirstPreset', () => {
    const asicMock = { ip: 'ip', password: 'hash' } as Asic;

    let loginSpy: jest.SpiedFunction<AsicsApiService['login']>;
    let startSpy: jest.SpiedFunction<AsicsApiService['start']>;
    let getPresetsSpy: jest.SpiedFunction<AsicsApiService['getPresets']>;
    let changePresetSpy: jest.SpiedFunction<
      AsicsScalingUpStrategy['changePreset']
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
      AsicsScalingUpStrategy['changePreset']
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
});
