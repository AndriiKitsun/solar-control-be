import { Test } from '@nestjs/testing';
import { ProtectionRulesService } from '@modules/protection-rules';

describe('ProtectionRulesService', () => {
  let service: ProtectionRulesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ProtectionRulesService],
    }).compile();

    service = module.get(ProtectionRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
