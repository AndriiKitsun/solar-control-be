import { Test, TestingModule } from '@nestjs/testing';
import { HttpApiService } from '@api/common';
import { EspApiService } from '@api/modules';
import { EspConfig } from '@config/api';
import { EspConfigMock } from '@config/api/esp/mocks/esp.config.mock';
import { HttpApiServiceMock } from '../../common/modules/http-api/mocks/http-api.service.mock';

describe('EspApiService', () => {
  let service: EspApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EspApiService,
        {
          provide: EspConfig.KEY,
          useValue: EspConfigMock,
        },
        {
          provide: HttpApiService,
          useClass: HttpApiServiceMock,
        },
      ],
    }).compile();

    service = module.get(EspApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
