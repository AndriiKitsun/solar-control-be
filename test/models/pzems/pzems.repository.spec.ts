import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PzemsRepository, Pzem } from '@models/pzems';

describe('PzemsRepository', () => {
  let repository: PzemsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PzemsRepository,
        {
          provide: getRepositoryToken(Pzem),
          useValue: {},
        },
      ],
    }).compile();

    repository = module.get(PzemsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
