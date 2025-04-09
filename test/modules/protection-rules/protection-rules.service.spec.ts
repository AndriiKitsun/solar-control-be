import { Test } from '@nestjs/testing';
import { ProtectionRuleService } from '@modules/automation/protection-rule/protection-rule.service';
import { ProtectionRuleRepository } from '@modules/automation/protection-rule/protection-rule.repository';
import { ProtectionRuleExecutor } from '@modules/automation/protection-rule/protection-rule.executor';
import { ProtectionRuleId } from '@modules/automation/protection-rule/enums';
import { ProtectionRulesRepositoryMock } from './mocks/protection-rules.repository.mock';
import { ProtectionRuleDtoMock } from './dto/mocks/protection-rules.dto.mock';
import { EspProtectionRulesApiService } from '@api/modules/esp';
import { EspProtectionRulesApiServiceMock } from '@api/modules/esp/collections/protection-rules/mocks/protection-rules.service.mock';
import { ProtectionRulesExecutorMock } from './mocks/protection-rules.executor.mock';
import { AsicsService } from '@modules/asics/asics.service';
import { AsicsServiceMock } from '../asics/mocks/asics.service.mock';
import { LogsService } from '@modules/logs/logs.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RelaysService } from '@modules/relays/relays.service';
import { RelaysServiceMock } from '../relays/mocks/relays.service.mock';

describe('ProtectionRulesService', () => {
  let service: ProtectionRuleService;
  let protectionRulesRepository: ProtectionRuleRepository;

  const { protectionRuleDtoMock } = ProtectionRuleDtoMock;
  const { protectionRuleMock, protectionRulesMock } =
    ProtectionRulesRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProtectionRuleService,
        {
          provide: ProtectionRuleRepository,
          useClass: ProtectionRulesRepositoryMock,
        },
        {
          provide: EspProtectionRulesApiService,
          useClass: EspProtectionRulesApiServiceMock,
        },
        {
          provide: ProtectionRuleExecutor,
          useClass: ProtectionRulesExecutorMock,
        },
        {
          provide: AsicsService,
          useClass: AsicsServiceMock,
        },
        {
          provide: LogsService,
          useValue: {},
        },
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
        {
          provide: RelaysService,
          useClass: RelaysServiceMock,
        },
      ],
    }).compile();

    service = module.get(ProtectionRuleService);
    protectionRulesRepository = module.get(ProtectionRuleRepository);
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
