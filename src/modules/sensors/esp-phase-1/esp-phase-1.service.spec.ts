import { Test, TestingModule } from '@nestjs/testing';
import { EspPhase1Service } from './esp-phase-1.service';

describe('EspPhase1Service', () => {
  let service: EspPhase1Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EspPhase1Service],
    }).compile();

    service = module.get<EspPhase1Service>(EspPhase1Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
