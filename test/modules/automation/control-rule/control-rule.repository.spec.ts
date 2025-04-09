import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RepositoryMock } from '@common/mocks/repository.mock';
import { Repository } from 'typeorm';
import { ControlRuleRepository } from '@modules/automation/control-rule/control-rule.repository';
import { ControlRule } from '@modules/automation/control-rule/entities';
import { ControlRuleDtoMock } from './dto/mocks/control-rule.dto.mock';
import { ControlRuleRepositoryMock } from './mocks/control-rule.repository.mock';
import { ControlRuleId } from '@modules/automation/control-rule/enums';

describe('ControlRuleRepository', () => {
  let repository: ControlRuleRepository;
  let controlRuleRepository: Repository<ControlRule>;

  const { controlRuleDtoMock } = ControlRuleDtoMock;
  const { controlRulesMock, controlRuleMock } = ControlRuleRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ControlRuleRepository,
        {
          provide: getRepositoryToken(ControlRule),
          useClass: RepositoryMock<ControlRule>,
        },
      ],
    }).compile();

    repository = module.get(ControlRuleRepository);
    controlRuleRepository = module.get(getRepositoryToken(ControlRule));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getRules', () => {
    it('should return all rules', async () => {
      const findSpy = jest
        .spyOn(controlRuleRepository, 'find')
        .mockResolvedValueOnce(controlRulesMock);

      const result = await repository.getRules();

      expect(findSpy).toHaveBeenCalled();

      expect(result).toBe(controlRulesMock);
    });
  });

  describe('saveRule', () => {
    it('should return saved rule', async () => {
      const saveSpy = jest
        .spyOn(controlRuleRepository, 'save')
        .mockResolvedValueOnce(controlRuleMock);
      const expectedPayload: ControlRule = {
        id: ControlRuleId.DC_BATTERY_AVG_VOLTAGE,
        ...controlRuleDtoMock,
      };

      const result = await repository.saveRule(
        ControlRuleId.DC_BATTERY_AVG_VOLTAGE,
        controlRuleDtoMock,
      );

      expect(saveSpy).toHaveBeenCalledWith(expectedPayload);

      expect(result).toBe(controlRuleMock);
    });
  });
});
