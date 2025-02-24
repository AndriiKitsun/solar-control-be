import { Test } from '@nestjs/testing';
import {
  ProtectionRulesRepository,
  ProtectionRule,
  ProtectionRuleId,
} from '@modules/protection-rules';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RepositoryMock } from '@common/mocks/repository.mock';
import { Repository } from 'typeorm';
import { ProtectionRuleDtoMock } from './dto/mocks/protection-rules.dto.mock';
import { ProtectionRulesRepositoryMock } from './mocks/protection-rules.repository.mock';

describe('ProtectionRulesRepository', () => {
  let repository: ProtectionRulesRepository;
  let protectionRulesRepository: Repository<ProtectionRule>;

  const { protectionRuleDtoMock } = ProtectionRuleDtoMock;
  const { protectionRuleMock, protectionRulesMock } =
    ProtectionRulesRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProtectionRulesRepository,
        {
          provide: getRepositoryToken(ProtectionRule),
          useClass: RepositoryMock<ProtectionRule>,
        },
      ],
    }).compile();

    repository = module.get(ProtectionRulesRepository);
    protectionRulesRepository = module.get(getRepositoryToken(ProtectionRule));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
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
});
