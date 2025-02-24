import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SensorsRepository, Sensor } from '@modules/sensors';

describe('SensorsRepository', () => {
  let repository: SensorsRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SensorsRepository,
        {
          provide: getRepositoryToken(Sensor),
          useValue: {},
        },
      ],
    }).compile();

    repository = module.get(SensorsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
