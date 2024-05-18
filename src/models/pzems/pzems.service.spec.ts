import { Test, TestingModule } from '@nestjs/testing';
import { PzemsService } from './pzems.service';

describe('PzemsService', () => {
  let service: PzemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PzemsService],
    }).compile();

    service = module.get<PzemsService>(PzemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
