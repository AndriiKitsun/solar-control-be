import { Test } from '@nestjs/testing';
import { ControlRuleService } from '@modules/automation/control-rule/control-rule.service';
import { ControlRuleDtoMock } from './dto/mocks/control-rule.dto.mock';
import { ControlRuleRepositoryMock } from './mocks/control-rule.repository.mock';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ControlRuleRepository } from '@modules/automation/control-rule/control-rule.repository';
import { EventEmitter2Mock } from '@common/mocks/event-emitter2.mock';
import { ControlRuleId } from '@modules/automation/control-rule/enums';
import { CONTROL_RULE_SAVED_EVENT } from '@modules/automation/control-rule/control-rule.constants';

describe('ControlRuleService', () => {
  let service: ControlRuleService;
  let controlRuleRepository: ControlRuleRepository;
  let eventEmitter: EventEmitter2;

  const { controlRuleDtoMock } = ControlRuleDtoMock;
  const { controlRulesMock, controlRuleMock } = ControlRuleRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ControlRuleService,
        {
          provide: ControlRuleRepository,
          useClass: ControlRuleRepositoryMock,
        },
        {
          provide: EventEmitter2,
          useClass: EventEmitter2Mock,
        },
      ],
    }).compile();

    service = module.get(ControlRuleService);
    controlRuleRepository = module.get(ControlRuleRepository);
    eventEmitter = module.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRules', () => {
    it('should return all rules', async () => {
      const getRulesSpy = jest.spyOn(controlRuleRepository, 'getRules');

      const result = await service.getRules();

      expect(getRulesSpy).toHaveBeenCalled();

      expect(result).toBe(controlRulesMock);
    });
  });

  describe('saveRule', () => {
    it('should return saved rule', async () => {
      const saveRuleSpy = jest.spyOn(controlRuleRepository, 'saveRule');

      const result = await service.saveRule(
        ControlRuleId.DC_BATTERY_AVG_VOLTAGE,
        controlRuleDtoMock,
      );

      expect(saveRuleSpy).toHaveBeenCalledWith(
        ControlRuleId.DC_BATTERY_AVG_VOLTAGE,
        controlRuleDtoMock,
      );

      expect(result).toBe(controlRuleMock);
    });

    it('should emit event about saved control rule', async () => {
      const emitSpy = jest.spyOn(eventEmitter, 'emit');

      await service.saveRule(
        ControlRuleId.DC_BATTERY_AVG_VOLTAGE,
        controlRuleDtoMock,
      );

      expect(emitSpy).toHaveBeenCalledWith(
        CONTROL_RULE_SAVED_EVENT,
        controlRuleMock,
      );
    });
  });
});
