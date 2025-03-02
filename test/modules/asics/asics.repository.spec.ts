import { Test } from '@nestjs/testing';
import { AsicsRepository } from '@modules/asics/asics.repository';
import { Asic } from '@modules/asics/entities';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AsicsRepository', () => {
  let repository: AsicsRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
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
