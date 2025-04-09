import { Test } from '@nestjs/testing';
import {
  AsicsScalingStrategyExecutor,
  AsicsScalingUpStrategy,
  AsicsScalingDownStrategy,
} from '@modules/asics/strategies';
import { AsicsScalingStrategyMock } from './mocks/asics-scaling.strategy.mock';
import { ControlRuleRepositoryMock } from '../../../automation/control-rule/mocks/control-rule.repository.mock';
import { AppConfig } from '@config/app.config';
import { AppConfigMock } from '@config/mocks/app.config.mock';

describe('AsicsScalingStrategyExecutor', () => {
  let executor: AsicsScalingStrategyExecutor;
  let asicsScalingUpStrategy: AsicsScalingUpStrategy;
  let asicsScalingDownStrategy: AsicsScalingDownStrategy;

  const { controlRuleMock } = ControlRuleRepositoryMock;

  jest.useFakeTimers();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsScalingStrategyExecutor,
        {
          provide: AsicsScalingUpStrategy,
          useClass: AsicsScalingStrategyMock,
        },
        {
          provide: AsicsScalingDownStrategy,
          useClass: AsicsScalingStrategyMock,
        },
        {
          provide: AppConfig.KEY,
          useValue: AppConfigMock,
        },
      ],
    }).compile();

    executor = module.get(AsicsScalingStrategyExecutor);
    asicsScalingUpStrategy = module.get(AsicsScalingUpStrategy);
    asicsScalingDownStrategy = module.get(AsicsScalingDownStrategy);
  });

  it('should be defined', () => {
    expect(executor).toBeDefined();
  });

  describe('execute', () => {
    let startScalingTimerSpy: jest.SpiedFunction<
      AsicsScalingStrategyExecutor['startScalingTimer']
    >;

    beforeEach(() => {
      startScalingTimerSpy = jest.spyOn(executor, 'startScalingTimer');

      AppConfigMock.feature.asicsControlEnabled = true;
    });

    it('should not execute when feature switcher is disabled', () => {
      AppConfigMock.feature.asicsControlEnabled = false;

      executor.execute(controlRuleMock);

      expect(startScalingTimerSpy).not.toHaveBeenCalled();
    });

    it('should handle array of rules', () => {
      executor.execute([controlRuleMock]);

      expect(startScalingTimerSpy).toHaveBeenCalledWith(controlRuleMock);
    });

    it('should handle rule', () => {
      executor.execute(controlRuleMock);

      expect(startScalingTimerSpy).toHaveBeenCalledWith(controlRuleMock);
    });
  });

  describe('startScalingTimer', () => {
    let scalingUpRunSpy: jest.SpiedFunction<AsicsScalingUpStrategy['run']>;
    let scalingDownRunSpy: jest.SpiedFunction<AsicsScalingDownStrategy['run']>;

    beforeEach(() => {
      jest.spyOn(global, 'setInterval');
      jest.spyOn(global, 'setTimeout');

      scalingUpRunSpy = jest.spyOn(asicsScalingUpStrategy, 'run');
      scalingDownRunSpy = jest.spyOn(asicsScalingDownStrategy, 'run');
    });

    it('should start timers', () => {
      executor.startScalingTimer(controlRuleMock);

      expect(setInterval).toHaveBeenNthCalledWith(
        1,
        expect.any(Function),
        180_000,
      );
      expect(setInterval).toHaveBeenNthCalledWith(
        2,
        expect.any(Function),
        120_000,
      );
    });

    it('should execute scaling down strategy', () => {
      executor.startScalingTimer(controlRuleMock);

      jest.advanceTimersToNextTimer();

      expect(scalingDownRunSpy).toHaveBeenCalledWith(controlRuleMock);
      expect(scalingUpRunSpy).not.toHaveBeenCalled();
    });

    it('should execute scaling up strategy after scaling down', () => {
      executor.startScalingTimer(controlRuleMock);

      jest.advanceTimersByTime(controlRuleMock.scaleUpCheckTime * 1000);

      expect(scalingDownRunSpy).toHaveBeenCalledWith(controlRuleMock);
      expect(scalingUpRunSpy).toHaveBeenCalledWith(controlRuleMock);
    });
  });
});
