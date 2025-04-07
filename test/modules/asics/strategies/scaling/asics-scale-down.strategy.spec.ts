import { Test } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Sensor } from '@modules/sensors/entities';
import { ControlRule } from '@modules/automation/control-rule/entities';
import { ControlRuleId } from '@modules/automation/control-rule/enums';
import { SensorId } from '@modules/sensors/enums';
import { Cache } from 'cache-manager';
import { AsicsScaleDownStrategy } from '@modules/asics/strategies/scaling/asics-scale-down.strategy';
import { AsicsScaleUpStrategy } from '@modules/asics/strategies/scaling/asics-scale-up.strategy';
import { SENSORS_DATA_CACHE } from '@modules/sensors/sensors.constants';

jest.mock('@common/utils', () => ({
  decrypt: jest.fn(() => 'password'),
  delay: jest.fn(),
}));

describe('AsicsScaleDownStrategy', () => {
  let strategy: AsicsScaleDownStrategy;
  let cache: Cache;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsScaleDownStrategy,
        {
          provide: CACHE_MANAGER,
          useClass: Map,
        },
      ],
    }).compile();

    strategy = module.get(AsicsScaleDownStrategy);
    cache = module.get(CACHE_MANAGER);
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

    let getSpy: jest.SpiedFunction<Cache['get']>;
    let shouldScaleSpy: jest.SpiedFunction<AsicsScaleUpStrategy['shouldScale']>;

    beforeEach(() => {
      getSpy = jest.spyOn(cache, 'get');
      shouldScaleSpy = jest.spyOn(strategy, 'shouldScale');
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
        scaleDownValue: 123,
      } as ControlRule;

      const result = strategy.shouldScale(sensorMock, ruleMock);

      expect(result).toBe(false);
    });

    it('should return true when dc avg voltage is less than scale down value', () => {
      const sensorMock = {
        sensors: [{ name: SensorId.DC_BATTERY, avgVoltage: 50 }],
      } as unknown as Sensor;
      const ruleMock = {
        id: ControlRuleId.DC_BATTERY_AVG_VOLTAGE,
        scaleDownValue: 60,
      } as ControlRule;

      const result = strategy.shouldScale(sensorMock, ruleMock);

      expect(result).toBe(true);
    });

    it('should return false when dc avg voltage is more than scale down value', () => {
      const sensorMock = {
        sensors: [{ name: SensorId.DC_BATTERY, avgVoltage: 70 }],
      } as unknown as Sensor;
      const ruleMock = {
        id: ControlRuleId.DC_BATTERY_AVG_VOLTAGE,
        scaleDownValue: 60,
      } as ControlRule;

      const result = strategy.shouldScale(sensorMock, ruleMock);

      expect(result).toBe(false);
    });
  });
});
