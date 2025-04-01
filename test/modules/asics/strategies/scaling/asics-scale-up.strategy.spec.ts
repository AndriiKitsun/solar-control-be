import { Test } from '@nestjs/testing';
import { AsicsService } from '@modules/asics/asics.service';
import { AsicsScaleUpStrategy } from '@modules/asics/strategies/scaling/asics-scale-up.strategy';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AsicsApiService, AsicPerfSummary, AsicStatus } from '@api/modules';
import { AsicsApiServiceMock } from '@api/modules/asics/mocks/asics.service.mock';
import { AsicsServiceMock } from '../../mocks/asics.service.mock';
import { Asic } from '@modules/asics/entities';
import { LoggerServiceMock } from '@common/mocks/logger.service.mock';
import { Sensor } from '@modules/sensors/entities';
import { ControlRule } from '@modules/automation/control-rule/entities';
import { ControlRuleId } from '@modules/automation/control-rule/enums';
import { SensorId } from '@modules/sensors/enums';

describe('AsicsScaleUpStrategy', () => {
  let strategy: AsicsScaleUpStrategy;
  // let asicsService: AsicsService;
  let asicsApiService: AsicsApiService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsScaleUpStrategy,
        {
          provide: CACHE_MANAGER,
          useValue: {},
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
    // asicsService = module.get(AsicsService);
    asicsApiService = module.get(AsicsApiService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
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

    it('should save first asic with stopped status', async () => {
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

      await strategy.findFirstStoppedAsic(asicsMock);

      expect(getStatusSpy).toHaveBeenNthCalledWith(1, asic1Mock.ip);
      expect(getStatusSpy).toHaveBeenNthCalledWith(2, asic2Mock.ip);
      expect(getStatusSpy).toHaveBeenNthCalledWith(3, asic3Mock.ip);
      expect(getStatusSpy).toHaveBeenNthCalledWith(4, asic4Mock.ip);

      expect(strategy.savedAsic).toEqual(asic3Mock);
    });

    it('should not save when no stopped asics', async () => {
      const asic1Mock = { ip: '1' };
      const asic2Mock = { ip: '2' };
      const asicsMock = [asic1Mock, asic2Mock] as Asic[];

      const asic1Status = {
        miner_state: 'initializing',
      } as AsicStatus;

      getStatusSpy
        .mockResolvedValueOnce(asic1Status)
        .mockRejectedValueOnce(new Error('error'));

      await strategy.findFirstStoppedAsic(asicsMock);

      expect(getStatusSpy).toHaveBeenNthCalledWith(1, asic1Mock.ip);
      expect(getStatusSpy).toHaveBeenNthCalledWith(2, asic2Mock.ip);

      expect(strategy.savedAsic).toBeUndefined();
    });
  });

  describe('findAsicWithSmallestPreset', () => {
    let getPerfSummarySpy: jest.SpiedFunction<
      AsicsApiService['getPerfSummary']
    >;

    beforeEach(() => {
      getPerfSummarySpy = jest.spyOn(asicsApiService, 'getPerfSummary');
    });

    it('should save asic and preset with smallest activated preset', async () => {
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

      await strategy.findAsicWithSmallestPreset(asicsMock);

      expect(getPerfSummarySpy).toHaveBeenNthCalledWith(1, asic1Mock.ip);
      expect(getPerfSummarySpy).toHaveBeenNthCalledWith(2, asic2Mock.ip);
      expect(getPerfSummarySpy).toHaveBeenNthCalledWith(3, asic3Mock.ip);
      expect(getPerfSummarySpy).toHaveBeenNthCalledWith(4, asic4Mock.ip);
      expect(getPerfSummarySpy).toHaveBeenNthCalledWith(5, asic5Mock.ip);

      expect(strategy.savedAsic).toEqual(asic4Mock);
      expect(strategy.savedPerfSummary).toEqual(asic4PerfSummaryMock);
    });

    it('should saved first asic when array contains only one element', async () => {
      const asic1Mock = { ip: '1' };
      const asicsMock = [asic1Mock] as Asic[];

      const asic1PerfSummaryMock = {
        current_preset: { name: '2300' },
      } as AsicPerfSummary;

      getPerfSummarySpy.mockResolvedValueOnce(asic1PerfSummaryMock);

      await strategy.findAsicWithSmallestPreset(asicsMock);

      expect(strategy.savedAsic).toEqual(asic1Mock);
      expect(strategy.savedPerfSummary).toEqual(asic1PerfSummaryMock);
    });

    it('should not save when perf summary is not provided', async () => {
      const asic1Mock = { ip: '1' };
      const asicsMock = [asic1Mock] as Asic[];

      getPerfSummarySpy.mockResolvedValueOnce(undefined);

      await strategy.findAsicWithSmallestPreset(asicsMock);

      expect(strategy.savedAsic).toBeUndefined();
      expect(strategy.savedPerfSummary).toBeUndefined();
    });
  });
});
