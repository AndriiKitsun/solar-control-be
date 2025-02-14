import { Test } from '@nestjs/testing';
import {
  ProtectionRulesController,
  ProtectionRulesService,
} from '@modules/protection-rules';

describe('ProtectionRulesController', () => {
  let controller: ProtectionRulesController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProtectionRulesController],
      providers: [ProtectionRulesService],
    }).compile();

    controller = module.get(ProtectionRulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
