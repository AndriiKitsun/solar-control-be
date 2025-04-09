import { Test } from '@nestjs/testing';
import { ProtectionRuleService } from '@modules/automation/protection-rule/protection-rule.service';
import { ProtectionRuleController } from '@modules/automation/protection-rule/protection-rule.controller';
import { ProtectionRulesServiceMock } from './mocks/protection-rules.service.mock';
import { ProtectionRuleDtoMock } from './dto/mocks/protection-rules.dto.mock';
import { ProtectionRulesRepositoryMock } from './mocks/protection-rules.repository.mock';
import { ProtectionRuleParamsMock } from './params/protection-rule.params.mock';

describe('ProtectionRulesController', () => {
  let controller: ProtectionRuleController;
  let protectionRulesService: ProtectionRuleService;

  const { protectionRuleParamsMock } = ProtectionRuleParamsMock;
  const { protectionRuleDtoMock } = ProtectionRuleDtoMock;
  const { protectionRuleMock, protectionRulesMock } =
    ProtectionRulesRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProtectionRuleController],
      providers: [
        {
          provide: ProtectionRuleService,
          useClass: ProtectionRulesServiceMock,
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
