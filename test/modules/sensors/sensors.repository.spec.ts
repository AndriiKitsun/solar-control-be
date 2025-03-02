import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SensorsRepository } from '@modules/sensors/sensors.repository';
import { Sensor } from '@modules/sensors/entities';

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
