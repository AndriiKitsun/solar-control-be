import { Test } from '@nestjs/testing';
import {
  ProtectionRulesService,
  ProtectionRulesRepository,
} from '@modules/protection-rules';
import { ProtectionRulesRepositoryMock } from './mocks/protection-rules.repository.mock';
import { ProtectionRuleDtoMock } from './dto/mocks/protection-rules.dto.mock';

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

      const result = await service.saveRule(protectionRuleDtoMock);

      expect(saveRuleSpy).toHaveBeenCalledWith(protectionRuleDtoMock);

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
