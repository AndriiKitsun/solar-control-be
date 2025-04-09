import { Test } from '@nestjs/testing';
import { ProtectionRuleService } from '@modules/automation/protection-rule/protection-rule.service';
import { ProtectionRuleController } from '@modules/automation/protection-rule/protection-rule.controller';
import { ProtectionRuleServiceMock } from './mocks/protection-rule.service.mock';
import { ProtectionRuleDtoMock } from './dto/mocks/protection-rule.dto.mock';
import { ProtectionRuleRepositoryMock } from './mocks/protection-rule.repository.mock';
import { ProtectionRuleParamsMock } from './params/protection-rule.params.mock';

describe('ProtectionRuleController', () => {
  let controller: ProtectionRuleController;
  let protectionRulesService: ProtectionRuleService;

  const { protectionRuleParamsMock } = ProtectionRuleParamsMock;
  const { protectionRuleDtoMock } = ProtectionRuleDtoMock;
  const { protectionRuleMock, protectionRulesMock } =
    ProtectionRuleRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProtectionRuleController],
      providers: [
        {
          provide: ProtectionRuleService,
          useClass: ProtectionRuleServiceMock,
        },
      ],
    }).compile();

    controller = module.get(ProtectionRuleController);
    protectionRulesService = module.get(ProtectionRuleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('saveRule', () => {
    it('should return saved rule', async () => {
      const saveRuleSpy = jest.spyOn(protectionRulesService, 'saveRule');

      const result = await controller.saveRule(
        protectionRuleParamsMock,
        protectionRuleDtoMock,
      );

      expect(saveRuleSpy).toHaveBeenCalledWith(
        protectionRuleParamsMock.id,
        protectionRuleDtoMock,
      );

      expect(result).toBe(protectionRuleMock);
    });
  });

  describe('getRules', () => {
    it('should return all rules', async () => {
      const getRulesSpy = jest.spyOn(protectionRulesService, 'getRules');

      const result = await controller.getRules();

      expect(getRulesSpy).toHaveBeenCalled();

      expect(result).toBe(protectionRulesMock);
    });
  });
});
