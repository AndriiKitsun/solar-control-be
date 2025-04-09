import { Test } from '@nestjs/testing';
import { ProtectionRuleRepository } from '@modules/automation/protection-rule/protection-rule.repository';
import { ProtectionRule } from '@modules/automation/protection-rule/entities';
import { ProtectionRuleId } from '@modules/automation/protection-rule/enums';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RepositoryMock } from '@common/mocks/repository.mock';
import { Repository } from 'typeorm';
import { ProtectionRuleDtoMock } from './dto/mocks/protection-rule.dto.mock';
import { ProtectionRuleRepositoryMock } from './mocks/protection-rule.repository.mock';

describe('ProtectionRuleRepository', () => {
  let repository: ProtectionRuleRepository;
  let protectionRulesRepository: Repository<ProtectionRule>;

  const { protectionRuleDtoMock } = ProtectionRuleDtoMock;
  const { protectionRuleMock, protectionRulesMock } =
    ProtectionRuleRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProtectionRuleRepository,
        {
          provide: getRepositoryToken(ProtectionRule),
          useClass: RepositoryMock<ProtectionRule>,
        },
      ],
    }).compile();

    repository = module.get(ProtectionRuleRepository);
    protectionRulesRepository = module.get(getRepositoryToken(ProtectionRule));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getRules', () => {
    it('should return all rules', async () => {
      const findSpy = jest
        .spyOn(protectionRulesRepository, 'find')
        .mockResolvedValueOnce(protectionRulesMock);

      const result = await repository.getRules();

      expect(findSpy).toHaveBeenCalled();

      expect(result).toBe(protectionRulesMock);
    });
  });

  describe('getEnabledRules', () => {
    it('should return all enabled rules', async () => {
      const findSpy = jest
        .spyOn(protectionRulesRepository, 'find')
        .mockResolvedValueOnce(protectionRulesMock);

      const result = await repository.getEnabledRules();

      expect(findSpy).toHaveBeenCalledWith({
        where: {
          enabled: true,
        },
        cache: expect.any(Object),
      });

      expect(result).toBe(protectionRulesMock);
    });
  });

  describe('saveRule', () => {
    it('should return saved rule', async () => {
      const saveSpy = jest
        .spyOn(protectionRulesRepository, 'save')
        .mockResolvedValueOnce(protectionRuleMock);
      const expectedPayload: ProtectionRule = {
        id: ProtectionRuleId.AC_OUTPUT_AVG_VOLTAGE,
        ...protectionRuleDtoMock,
      };

      const result = await repository.saveRule(
        ProtectionRuleId.AC_OUTPUT_AVG_VOLTAGE,
        protectionRuleDtoMock,
      );

      expect(saveSpy).toHaveBeenCalledWith(expectedPayload);

      expect(result).toBe(protectionRuleMock);
    });
  });
});
