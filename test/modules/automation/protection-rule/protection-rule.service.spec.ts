import { Test } from '@nestjs/testing';
import { ProtectionRuleService } from '@modules/automation/protection-rule/protection-rule.service';
import { ProtectionRuleRepository } from '@modules/automation/protection-rule/protection-rule.repository';
import { ProtectionStrategyExecutor } from '@modules/automation/protection-rule/strategies/protection-strategy.executor';
import { ProtectionRuleId } from '@modules/automation/protection-rule/enums';
import { ProtectionRuleRepositoryMock } from './mocks/protection-rule.repository.mock';
import { ProtectionRuleDtoMock } from './dto/mocks/protection-rule.dto.mock';
import { EspProtectionRulesApiService } from '@api/modules/esp';
import { EspProtectionRulesApiServiceMock } from '@api/modules/esp/collections/protection-rules/mocks/protection-rules.service.mock';
import { ProtectionStrategyExecutorMock } from './strategies/mocks/protection-strategy.executor.mock';
import { AsicsService } from '@modules/asics/asics.service';
import { AsicsServiceMock } from '../../asics/mocks/asics.service.mock';
import { LogsService } from '@modules/logs/logs.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MessageEvent } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PROTECTION_RESULT_KEY } from '@modules/automation/protection-rule/protection-rule.constants';
import { ProtectionResultDto } from '@modules/automation/protection-rule/dto';
import { AsicsRepositoryMock } from '../../asics/mocks/asics.repository.mock';
import { LogType } from '@modules/logs/enums';
import { LogsServiceMock } from '../../logs/mocks/logs.service.mock';
import { SensorsRepositoryMock } from '../../sensors/mocks/sensors.repository.mock';
import { LoggerServiceMock } from '@common/mocks/logger.service.mock';

describe('ProtectionRuleService', () => {
  let service: ProtectionRuleService;
  let protectionRulesRepository: ProtectionRuleRepository;
  let espProtectionRulesApiService: EspProtectionRulesApiService;
  let protectionStrategyExecutor: ProtectionStrategyExecutor;
  let asicsService: AsicsService;
  let logsService: LogsService;
  let cache: Cache;

  const { emptySensorMock, sensorMock } = SensorsRepositoryMock;
  const { protectionRuleMock, protectionRulesMock } =
    ProtectionRuleRepositoryMock;
  const { protectionResultMock } = ProtectionStrategyExecutorMock;
  const { asicsMock } = AsicsRepositoryMock;
  const { protectionRuleDtoMock } = ProtectionRuleDtoMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProtectionRuleService,
        {
          provide: ProtectionRuleRepository,
          useClass: ProtectionRuleRepositoryMock,
        },
        {
          provide: EspProtectionRulesApiService,
          useClass: EspProtectionRulesApiServiceMock,
        },
        {
          provide: ProtectionStrategyExecutor,
          useClass: ProtectionStrategyExecutorMock,
        },
        {
          provide: AsicsService,
          useClass: AsicsServiceMock,
        },
        {
          provide: LogsService,
          useClass: LogsServiceMock,
        },
        {
          provide: CACHE_MANAGER,
          useClass: Map,
        },
      ],
    }).compile();

    module.useLogger(new LoggerServiceMock());

    service = module.get(ProtectionRuleService);
    protectionRulesRepository = module.get(ProtectionRuleRepository);
    espProtectionRulesApiService = module.get(EspProtectionRulesApiService);
    protectionStrategyExecutor = module.get(ProtectionStrategyExecutor);
    asicsService = module.get(AsicsService);
    logsService = module.get(LogsService);
    cache = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onSensorsEvent', () => {
    it('should not fetch rules if no sensor data', async () => {
      const getEnabledRulesSpy = jest.spyOn(
        protectionRulesRepository,
        'getEnabledRules',
      );

      await service.onSensorsEvent(emptySensorMock);

      expect(getEnabledRulesSpy).not.toHaveBeenCalled();
    });

    it('should not execute protection strategies when no enabled rules', async () => {
      const getEnabledRulesSpy = jest
        .spyOn(protectionRulesRepository, 'getEnabledRules')
        .mockResolvedValueOnce([]);
      const executeSpy = jest.spyOn(protectionStrategyExecutor, 'execute');

      await service.onSensorsEvent(sensorMock);

      expect(getEnabledRulesSpy).toHaveBeenCalled();
      expect(executeSpy).not.toHaveBeenCalled();
    });

    it('should execute protection strategies', async () => {
      const executeSpy = jest.spyOn(protectionStrategyExecutor, 'execute');
      const handleProtectionResultSpy = jest
        .spyOn(service, 'handleProtectionResult')
        .mockImplementation();

      await service.onSensorsEvent(sensorMock);

      expect(executeSpy).toHaveBeenCalledWith(sensorMock, protectionRulesMock);
      expect(handleProtectionResultSpy).toHaveBeenCalledWith(
        protectionResultMock,
      );
    });

    it('should log execution error', async () => {
      const errorMock = new Error('error');
      const errorSpy = jest.spyOn(service['logger'], 'error');
      const logsServiceErrorSpy = jest.spyOn(logsService, 'error');

      jest
        .spyOn(protectionStrategyExecutor, 'execute')
        .mockImplementationOnce(() => {
          throw errorMock;
        });

      await service.onSensorsEvent(sensorMock);

      expect(errorSpy).toHaveBeenCalledWith(errorMock);
      expect(logsServiceErrorSpy).toHaveBeenCalledWith({
        type: LogType.PROTECTION,
        message: 'The error occurred during handling protection rules',
      });
    });
  });

  describe('handleProtectionResult', () => {
    it('should store protection result in cache', async () => {
      const setSpy = jest.spyOn(cache, 'set');

      await service.handleProtectionResult(protectionResultMock);

      expect(setSpy).toHaveBeenCalledWith(
        PROTECTION_RESULT_KEY,
        protectionResultMock,
      );
    });

    it('should stream protection result via sse', async () => {
      const nextSpy = jest.spyOn(service['protectionResult$'], 'next');

      await service.handleProtectionResult(protectionResultMock);

      expect(nextSpy).toHaveBeenCalledWith(protectionResultMock);
    });

    it('should not stop asics when result is false', async () => {
      const resultMock = { triggered: false } as ProtectionResultDto;
      const stopAsicsSpy = jest.spyOn(asicsService, 'stopAsics');

      await service.handleProtectionResult(resultMock);
      await service.handleProtectionResult(resultMock);

      expect(stopAsicsSpy).not.toHaveBeenCalled();
    });

    it('should stop asics once until result changes', async () => {
      const resultMock = { triggered: true } as ProtectionResultDto;
      const findAllSpy = jest.spyOn(asicsService, 'findAll');
      const stopAsicsSpy = jest.spyOn(asicsService, 'stopAsics');

      await service.handleProtectionResult(resultMock);
      await service.handleProtectionResult(resultMock);

      expect(findAllSpy).toHaveBeenCalledTimes(1);

      expect(stopAsicsSpy).toHaveBeenCalledTimes(1);
      expect(stopAsicsSpy).toHaveBeenCalledWith(asicsMock, LogType.PROTECTION);
    });

    it('should stop asics two times after result change', async () => {
      const resultTrueMock = { triggered: true } as ProtectionResultDto;
      const resultFalseMock = { triggered: false } as ProtectionResultDto;

      const stopAsicsSpy = jest.spyOn(asicsService, 'stopAsics');

      await service.handleProtectionResult(resultTrueMock);
      await service.handleProtectionResult(resultTrueMock);
      await service.handleProtectionResult(resultFalseMock);
      await service.handleProtectionResult(resultTrueMock);

      expect(stopAsicsSpy).toHaveBeenCalledTimes(2);
      expect(stopAsicsSpy).toHaveBeenCalledWith(asicsMock, LogType.PROTECTION);
    });
  });

  describe('getRules', () => {
    it('should return all rules', async () => {
      const getRulesSpy = jest.spyOn(protectionRulesRepository, 'getRules');

      const result = await service.getRules();

      expect(getRulesSpy).toHaveBeenCalled();

      expect(result).toBe(protectionRulesMock);
    });
  });

  describe('getProtectionResultStream', () => {
    it('should stream protection result', (done) => {
      const expectedResult: MessageEvent = {
        data: protectionResultMock,
      };

      service.getProtectionResultStream().subscribe({
        next: (value: MessageEvent) => {
          expect(value).toEqual(expectedResult);

          done();
        },
      });

      service['protectionResult$'].next(protectionResultMock);
    });
  });

  describe('saveRule', () => {
    it('should return saved rule', async () => {
      const saveProtectionRuleSpy = jest.spyOn(
        espProtectionRulesApiService,
        'saveProtectionRule',
      );
      const saveRuleSpy = jest.spyOn(protectionRulesRepository, 'saveRule');

      const result = await service.saveRule(
        ProtectionRuleId.AC_OUTPUT_AVG_VOLTAGE,
        protectionRuleDtoMock,
      );

      expect(saveProtectionRuleSpy).toHaveBeenCalledWith(
        ProtectionRuleId.AC_OUTPUT_AVG_VOLTAGE,
        protectionRuleDtoMock,
      );

      expect(saveRuleSpy).toHaveBeenCalledWith(
        ProtectionRuleId.AC_OUTPUT_AVG_VOLTAGE,
        protectionRuleDtoMock,
      );

      expect(result).toBe(protectionRuleMock);
    });
  });
});
