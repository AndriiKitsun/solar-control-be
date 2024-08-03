import { Test, TestingModule } from '@nestjs/testing';
import { PzemsService } from './pzems.service';
import { PzemsRepository } from './pzems.repository';
import { EspApiService } from '@api/modules';

describe('PzemsService', () => {
  let service: PzemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PzemsService,
        {
          provide: PzemsRepository,
          useValue: {},
        },
        {
          provide: EspApiService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PzemsService>(PzemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
