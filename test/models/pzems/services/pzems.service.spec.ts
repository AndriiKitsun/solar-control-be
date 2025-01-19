import { Test, TestingModule } from '@nestjs/testing';
import { EspApiService } from '@api/modules';
import { PzemsService, PzemsRepository } from '@models/pzems';
import { PzemsRepositoryMock } from '../mocks/pzems.repository.mock';
import { EspApiServiceMock } from '@api/modules/esp/mocks/esp-service.mock';
import { AppConfig } from '@config/app';
import { AppConfigMock } from '@config/app/mocks/app.config.mock';

describe('PzemsService', () => {
  let service: PzemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PzemsService,
        {
          provide: PzemsRepository,
          useClass: PzemsRepositoryMock,
        },
        {
          provide: EspApiService,
          useClass: EspApiServiceMock,
        },
        {
          provide: AppConfig.KEY,
          useValue: AppConfigMock,
        },
      ],
    }).compile();

    service = module.get(PzemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
