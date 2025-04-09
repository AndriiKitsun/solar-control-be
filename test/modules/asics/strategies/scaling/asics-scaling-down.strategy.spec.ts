import { Test } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Sensor } from '@modules/sensors/entities';
import { ControlRule } from '@modules/automation/control-rule/entities';
import { ControlRuleId } from '@modules/automation/control-rule/enums';
import { SensorId } from '@modules/sensors/enums';
import { AsicsScalingDownStrategy } from '@modules/asics/strategies/scaling/asics-scaling-down.strategy';
import { AsicWithPerfSummary } from '@modules/asics/types/asic-scaling.types';
import { AsicsRepositoryMock } from '../../mocks/asics.repository.mock';
import { Asic } from '@modules/asics/entities';
import { AsicsScalingUpStrategy } from '@modules/asics/strategies';
import { AsicsRepository } from '@modules/asics/asics.repository';
import { AsicsAuthApiServiceMock } from '@api/modules/asics/collections/auth/mocks/auth.service.mock';
import { AsicsAutotuneApiServiceMock } from '@api/modules/asics/collections/autotune/mocks/autotune.service.mock';
import { AsicsOtherApiServiceMock } from '@api/modules/asics/collections/other/mocks/other.service.mock';
import { AsicsApiFacadeMock } from '@api/modules/asics/services/mocks/asics-api.facade.mock';
import { AsicPerfSummary, AsicsApiFacade } from '@api/modules/asics';

jest.mock('@common/utils', () => ({
  decrypt: jest.fn(() => 'password'),
  delay: jest.fn(),
}));

describe('AsicsScalingDownStrategy', () => {
  let strategy: AsicsScalingDownStrategy;
  let asicsApiFacade: AsicsApiFacade;

  const { asicMock, asicsMock } = AsicsRepositoryMock;
  const { tokenMock } = AsicsAuthApiServiceMock;
  const { asicTunedPreset1Mock, asicTunedPreset2Mock } =
    AsicsAutotuneApiServiceMock;
  const { asicPerfSummaryMock } = AsicsOtherApiServiceMock;

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
          provide: AsicsApiFacade,
          useClass: AsicsApiFacadeMock,
        },
      ],
    }).compile();

    strategy = module.get(AsicsScalingDownStrategy);
    asicsApiFacade = module.get(AsicsApiFacade);

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

    let loginSpy: jest.SpiedFunction<AsicsApiFacade['login']>;
    let getPresetsSpy: jest.SpiedFunction<AsicsApiFacade['getPresets']>;
    let changePresetSpy: jest.SpiedFunction<
      AsicsScalingUpStrategy['changePreset']
    >;

    beforeEach(() => {
      loginSpy = jest.spyOn(asicsApiFacade, 'login');
      getPresetsSpy = jest.spyOn(asicsApiFacade, 'getPresets');
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
      const stopSpy = jest.spyOn(asicsApiFacade, 'stop');

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
