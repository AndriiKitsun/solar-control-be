import { Test, TestingModule } from '@nestjs/testing';
import { AsicsRepository, Asic } from '../../../src/modules/asics';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AsicsRepository', () => {
  let repository: AsicsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AsicsRepository,
        {
          provide: getRepositoryToken(Asic),
          useValue: {},
        },
      ],
    }).compile();

    repository = module.get(AsicsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
