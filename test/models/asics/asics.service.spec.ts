import { Test, TestingModule } from '@nestjs/testing';
import { AsicsService, AsicsRepository } from '@models/asics';
import { AsicsApiService } from '@api/modules';
import { AsicsRepositoryMock } from './mocks/asics.repository.mock';
import { AsicsApiServiceMock } from '@api/modules/asics/mocks/asics.service.mock';

describe('AsicsService', () => {
  let service: AsicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AsicsService,
        {
          provide: AsicsRepository,
          useClass: AsicsRepositoryMock,
        },
        {
          provide: AsicsApiService,
          useClass: AsicsApiServiceMock,
        },
      ],
    }).compile();

    service = module.get(AsicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
