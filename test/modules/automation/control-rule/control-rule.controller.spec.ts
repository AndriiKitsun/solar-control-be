import { Test } from '@nestjs/testing';
import { ControlRuleParamsMock } from './params/control-rule.params.mock';
import { ControlRuleController } from '@modules/automation/control-rule/control-rule.controller';
import { ControlRuleService } from '@modules/automation/control-rule/control-rule.service';
import { ControlRuleDtoMock } from './dto/mocks/control-rule.dto.mock';
import { ControlRuleRepositoryMock } from './mocks/control-rule.repository.mock';
import { ControlRuleServiceMock } from './mocks/control-rule.service.mock';

describe('ControlRuleController', () => {
  let controller: ControlRuleController;
  let controlRuleService: ControlRuleService;

  const { controlRuleParamsMock } = ControlRuleParamsMock;
  const { controlRuleDtoMock } = ControlRuleDtoMock;
  const { controlRulesMock, controlRuleMock } = ControlRuleRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ControlRuleController],
      providers: [
        {
          provide: ControlRuleService,
          useClass: ControlRuleServiceMock,
        },
      ],
    }).compile();

    controller = module.get(ControlRuleController);
    controlRuleService = module.get(ControlRuleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRules', () => {
    it('should return all rules', async () => {
      const getRulesSpy = jest.spyOn(controlRuleService, 'getRules');

      const result = await controller.getRules();

      expect(getRulesSpy).toHaveBeenCalled();

      expect(result).toBe(controlRulesMock);
    });
  });

  describe('saveRule', () => {
    it('should return saved rule', async () => {
      const saveRuleSpy = jest.spyOn(controlRuleService, 'saveRule');

      const result = await controller.saveRule(
        controlRuleParamsMock,
        controlRuleDtoMock,
      );

      expect(saveRuleSpy).toHaveBeenCalledWith(
        controlRuleParamsMock.id,
        controlRuleDtoMock,
      );

      expect(result).toBe(controlRuleMock);
    });
  });
});
