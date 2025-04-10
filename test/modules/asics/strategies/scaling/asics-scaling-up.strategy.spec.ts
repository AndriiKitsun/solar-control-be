import { Test } from '@nestjs/testing';
import { AsicsScalingUpStrategy } from '@modules/asics/strategies/scaling/asics-scaling-up.strategy';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Asic } from '@modules/asics/entities';
import { ControlRule } from '@modules/automation/control-rule/entities';
import { ControlRuleId } from '@modules/automation/control-rule/enums';
import { delay } from '@common/utils';
import { ASIC_START_IDLE_TIME } from '@modules/asics/asics.constants';
import { AsicsRepositoryMock } from '../../mocks/asics.repository.mock';
import { AsicWithPerfSummary } from '@modules/asics/types/asic-scaling.types';
import { AsicsRepository } from '@modules/asics/asics.repository';
import {
  AsicsApiFacade,
  AsicStatus,
  AsicPerfSummary,
} from '@api/modules/asics';
import { AsicsAuthApiServiceMock } from '@api/modules/asics/collections/auth/mocks/auth.service.mock';
import { AsicsAutotuneApiServiceMock } from '@api/modules/asics/collections/autotune/mocks/autotune.service.mock';
import { AsicsOtherApiServiceMock } from '@api/modules/asics/collections/other/mocks/other.service.mock';
import { AsicsApiFacadeMock } from '@api/modules/asics/services/mocks/asics-api.facade.mock';
import { EspSensorsData, EspSensorId } from '@api/modules/esp';

jest.mock('@common/utils', () => ({
  decrypt: jest.fn(() => 'password'),
  delay: jest.fn(),
}));

describe('AsicsScalingUpStrategy', () => {
  let strategy: AsicsScalingUpStrategy;
  let asicsApiFacade: AsicsApiFacade;

  const { asicMock, asicsMock } = AsicsRepositoryMock;
  const { tokenMock } = AsicsAuthApiServiceMock;
  const { asicUntunedPresetMock, asicTunedPreset1Mock, asicTunedPreset2Mock } =
    AsicsAutotuneApiServiceMock;
  const { asicPerfSummaryMock } = AsicsOtherApiServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsScalingUpStrategy,
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

    strategy = module.get(AsicsScalingUpStrategy);
    asicsApiFacade = module.get(AsicsApiFacade);

    strategy.asics = asicsMock;
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('shouldScale', () => {
    it('should return false when rule is not related to dc battery sensor', () => {
      const sensorMock = {} as EspSensorsData;
      const ruleMock = { id: 'someRule' } as unknown as ControlRule;

      const result = strategy.shouldScale(sensorMock, ruleMock);

      expect(result).toBe(false);
    });

    it('should return false when no dc battery sensor data', () => {
      const sensorMock = { sensors: [] } as unknown as EspSensorsData;
      const ruleMock = {
        id: ControlRuleId.DC_BATTERY_AVG_VOLTAGE,
        scaleUpValue: 123,
      } as ControlRule;

      const result = strategy.shouldScale(sensorMock, ruleMock);

      expect(result).toBe(false);
    });

    it('should return false when dc avg voltage is less than scale up value', () => {
      const sensorMock = {
        sensors: [{ name: EspSensorId.DC_BATTERY, avgVoltage: 123 }],
      } as unknown as EspSensorsData;
      const ruleMock = {
        id: ControlRuleId.DC_BATTERY_AVG_VOLTAGE,
        scaleUpValue: 150,
      } as ControlRule;

      const result = strategy.shouldScale(sensorMock, ruleMock);

      expect(result).toBe(false);
    });

    it('should return true when dc avg voltage is more than scale up value', () => {
      const sensorMock = {
        sensors: [{ name: EspSensorId.DC_BATTERY, avgVoltage: 200 }],
      } as unknown as EspSensorsData;
      const ruleMock = {
        id: ControlRuleId.DC_BATTERY_AVG_VOLTAGE,
        scaleUpValue: 150,
      } as ControlRule;

      const result = strategy.shouldScale(sensorMock, ruleMock);

      expect(result).toBe(true);
    });
  });

  describe('scale', () => {
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
      findFirstStoppedAsicSpy = jest
        .spyOn(strategy, 'findFirstStoppedAsic')
        .mockImplementation();
      startAsicOnFirstPresetSpy = jest
        .spyOn(strategy, 'startAsicOnFirstPreset')
        .mockImplementation();

      findAsicWithPresetSpy = jest
        .spyOn(strategy, 'findAsicWithPreset')
        .mockImplementation();
      incrementAsicPresetSpy = jest
        .spyOn(strategy, 'incrementAsicPreset')
        .mockImplementation();
    });

    it('should scale by starting stopped asic', async () => {
      findFirstStoppedAsicSpy.mockResolvedValueOnce(asicMock);

      await strategy.scale();

      expect(findFirstStoppedAsicSpy).toHaveBeenCalledWith(asicsMock);
      expect(startAsicOnFirstPresetSpy).toHaveBeenCalledWith(asicMock);

      expect(findAsicWithPresetSpy).not.toHaveBeenCalled();
    });

    it('should scale by incrementing asic preset', async () => {
      const asicWithSummaryMock: AsicWithPerfSummary = {
        asic: asicMock,
        perfSummary: asicPerfSummaryMock,
      };

      findAsicWithPresetSpy.mockResolvedValueOnce(asicWithSummaryMock);

      await strategy.scale();

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

  describe('findFirstStoppedAsic', () => {
    let getStatusSpy: jest.SpiedFunction<AsicsApiFacade['getStatus']>;

    beforeEach(() => {
      getStatusSpy = jest.spyOn(asicsApiFacade, 'getStatus');
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

    let loginSpy: jest.SpiedFunction<AsicsApiFacade['login']>;
    let startSpy: jest.SpiedFunction<AsicsApiFacade['start']>;
    let getPresetsSpy: jest.SpiedFunction<AsicsApiFacade['getPresets']>;
    let changePresetSpy: jest.SpiedFunction<
      AsicsScalingUpStrategy['changePreset']
    >;

    beforeEach(() => {
      loginSpy = jest.spyOn(asicsApiFacade, 'login');
      startSpy = jest.spyOn(asicsApiFacade, 'start');
      getPresetsSpy = jest.spyOn(asicsApiFacade, 'getPresets');
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

    let loginSpy: jest.SpiedFunction<AsicsApiFacade['login']>;
    let getPresetsSpy: jest.SpiedFunction<AsicsApiFacade['getPresets']>;
    let changePresetSpy: jest.SpiedFunction<
      AsicsScalingUpStrategy['changePreset']
    >;

    beforeEach(() => {
      loginSpy = jest.spyOn(asicsApiFacade, 'login');
      getPresetsSpy = jest.spyOn(asicsApiFacade, 'getPresets');
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
