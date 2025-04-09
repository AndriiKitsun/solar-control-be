import { Test } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Sensor } from '@modules/sensors/entities';
import { ControlRule } from '@modules/automation/control-rule/entities';
import { ControlRuleId } from '@modules/automation/control-rule/enums';
import { SensorId } from '@modules/sensors/enums';
import { AsicsScalingDownStrategy } from '@modules/asics/strategies/scaling/asics-scaling-down.strategy';
import { AsicsApiService, AsicPerfSummary } from '@api/modules';
import { AsicsApiServiceMock } from '@api/modules/asics/mocks/asics.service.mock';
import { AsicWithPerfSummary } from '@modules/asics/types/asic-scaling.types';
import { AsicsRepositoryMock } from '../../mocks/asics.repository.mock';
import { Asic } from '@modules/asics/entities';
import { AsicsScalingUpStrategy } from '@modules/asics/strategies';
import { AsicsRepository } from '@modules/asics/asics.repository';

jest.mock('@common/utils', () => ({
  decrypt: jest.fn(() => 'password'),
  delay: jest.fn(),
}));

describe('AsicsScalingDownStrategy', () => {
  let strategy: AsicsScalingDownStrategy;
  let asicsApiService: AsicsApiService;

  const { asicMock, asicsMock } = AsicsRepositoryMock;
  const {
    tokenMock,
    asicTunedPreset1Mock,
    asicTunedPreset2Mock,
    asicPerfSummaryMock,
  } = AsicsApiServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsScalingDownStrategy,
        {
          provide: CACHE_MANAGER,
          useClass: Map,
        },
        {
          provide: AsicsRepository,
          useClass: AsicsRepositoryMock,
        },
        {
          provide: AsicsApiService,
          useClass: AsicsApiServiceMock,
        },
      ],
    }).compile();

    strategy = module.get(AsicsScalingDownStrategy);
    asicsApiService = module.get(AsicsApiService);

    strategy.asics = asicsMock;
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

  describe('scale', () => {
    it('should scale by decrementing asic preset', async () => {
      const asicWithSummaryMock: AsicWithPerfSummary = {
        asic: asicMock,
        perfSummary: asicPerfSummaryMock,
      };
      const findAsicWithPresetSpy = jest
        .spyOn(strategy, 'findAsicWithPreset')
        .mockResolvedValueOnce(asicWithSummaryMock);
      const decrementAsicPresetSpy = jest
        .spyOn(strategy, 'decrementAsicPreset')
        .mockImplementation();

      await strategy.scale();

      expect(findAsicWithPresetSpy).toHaveBeenCalledWith(
        asicsMock,
        expect.any(Function),
      );
      expect(decrementAsicPresetSpy).toHaveBeenCalledWith(
        asicMock,
        asicPerfSummaryMock,
      );
    });
  });

  describe('decrementAsicPreset', () => {
    const asicMock = { ip: 'ip', password: 'hash' } as Asic;

    let loginSpy: jest.SpiedFunction<AsicsApiService['login']>;
    let getPresetsSpy: jest.SpiedFunction<AsicsApiService['getPresets']>;
    let changePresetSpy: jest.SpiedFunction<
      AsicsScalingUpStrategy['changePreset']
    >;

    beforeEach(() => {
      loginSpy = jest.spyOn(asicsApiService, 'login');
      getPresetsSpy = jest.spyOn(asicsApiService, 'getPresets');
      changePresetSpy = jest
        .spyOn(strategy, 'changePreset')
        .mockImplementation();
    });

    it('should login asic and request presets', async () => {
      const perfSummaryMock = {} as AsicPerfSummary;

      await strategy.decrementAsicPreset(asicMock, perfSummaryMock);

      expect(loginSpy).toHaveBeenCalledWith(asicMock.ip, 'password');
      expect(getPresetsSpy).toHaveBeenCalledWith(asicMock.ip, tokenMock);
    });

    it('should not change preset when active preset not found', async () => {
      const perfSummaryMock = {
        current_preset: { name: 'kekw' },
      } as AsicPerfSummary;

      await strategy.decrementAsicPreset(asicMock, perfSummaryMock);

      expect(changePresetSpy).not.toHaveBeenCalled();
    });

    it('should stop asic when active preset is first', async () => {
      const perfSummaryMock = {
        current_preset: { name: asicTunedPreset1Mock.name },
      } as AsicPerfSummary;
      const stopSpy = jest.spyOn(asicsApiService, 'stop');

      await strategy.decrementAsicPreset(asicMock, perfSummaryMock);

      expect(stopSpy).toHaveBeenCalledWith(asicMock.ip, tokenMock);
      expect(changePresetSpy).not.toHaveBeenCalled();
    });

    it('should change preset using next tuned preset', async () => {
      const perfSummaryMock = {
        current_preset: { name: asicTunedPreset2Mock.name },
      } as AsicPerfSummary;

      await strategy.decrementAsicPreset(asicMock, perfSummaryMock);

      expect(changePresetSpy).toHaveBeenCalledWith(
        asicMock.ip,
        tokenMock,
        asicTunedPreset1Mock,
      );
    });
  });
});
