import { Test, TestingModule } from '@nestjs/testing';
import { PzemsGateway } from '../../../src/modules/pzems';

describe('PzemsGateway', () => {
  let gateway: PzemsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PzemsGateway],
    }).compile();

    gateway = module.get(PzemsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
