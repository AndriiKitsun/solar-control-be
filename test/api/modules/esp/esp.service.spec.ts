import { Test, TestingModule } from '@nestjs/testing';
import { EspApiService } from '@api/modules';
import { HttpApiServiceMock } from '../../common/modules/http-api/mocks/http-api.service.mock';
import { EspConfig } from '@config/esp';
import { EspConfigMock } from '@config/api/esp/mocks/esp.config.mock';
import { HttpClientService } from '@api/common/modules';

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
          provide: HttpClientService,
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
