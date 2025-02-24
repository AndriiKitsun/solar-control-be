import { Test } from '@nestjs/testing';
import {
  ProtectionRulesService,
  ProtectionRulesRepository,
  ProtectionRuleId,
  ProtectionRulesExecutor,
} from '@modules/protection-rules';
import { ProtectionRulesRepositoryMock } from './mocks/protection-rules.repository.mock';
import { ProtectionRuleDtoMock } from './dto/mocks/protection-rules.dto.mock';
import { EspProtectionRulesApiService } from '@api/modules/esp';
import { EspProtectionRulesApiServiceMock } from '@api/modules/esp/collections/protection-rules/mocks/protection-rules.service.mock';
import { ProtectionRulesExecutorMock } from './mocks/protection-rules.executor.mock';
import { AsicsApiService } from '@api/modules';
import { AsicsApiServiceMock } from '@api/modules/asics/mocks/asics.service.mock';
import { AsicsService } from '@modules/asics';
import { AsicsServiceMock } from '../asics/mocks/asics.service.mock';
import { LogsService } from '@modules/logs';

describe('ProtectionRulesService', () => {
  let service: ProtectionRulesService;
  let protectionRulesRepository: ProtectionRulesRepository;

  const { protectionRuleDtoMock } = ProtectionRuleDtoMock;
  const { protectionRuleMock, protectionRulesMock } =
    ProtectionRulesRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProtectionRulesService,
        {
          provide: ProtectionRulesRepository,
          useClass: ProtectionRulesRepositoryMock,
        },
        {
          provide: EspProtectionRulesApiService,
          useClass: EspProtectionRulesApiServiceMock,
        },
        {
          provide: ProtectionRulesExecutor,
          useClass: ProtectionRulesExecutorMock,
        },
        {
          provide: AsicsApiService,
          useClass: AsicsApiServiceMock,
        },
        {
          provide: AsicsService,
          useClass: AsicsServiceMock,
        },
        {
          provide: LogsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get(ProtectionRulesService);
    protectionRulesRepository = module.get(ProtectionRulesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveRule', () => {
    it('should return saved rule', async () => {
      const saveRuleSpy = jest.spyOn(protectionRulesRepository, 'saveRule');

      const result = await service.saveRule(
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

  describe('getRules', () => {
    it('should return all rules', async () => {
      const getRulesSpy = jest.spyOn(protectionRulesRepository, 'getRules');

      const result = await service.getRules();

      expect(getRulesSpy).toHaveBeenCalled();

      expect(result).toBe(protectionRulesMock);
    });
  });
});
