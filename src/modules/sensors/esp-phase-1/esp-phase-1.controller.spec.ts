import { Test, TestingModule } from '@nestjs/testing';
import { EspPhase1Controller } from './esp-phase-1.controller';
import { EspPhase1Service } from './esp-phase-1.service';

describe('EspPhase1Controller', () => {
  let controller: EspPhase1Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EspPhase1Controller],
      providers: [EspPhase1Service],
    }).compile();

    controller = module.get<EspPhase1Controller>(EspPhase1Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
