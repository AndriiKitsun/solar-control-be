import { Test, TestingModule } from '@nestjs/testing';
import { EspApiService } from '@api/modules';
import { EspConfig } from '@config/esp';
import { EspConfigMock } from '@config/esp/mocks/esp.config.mock';
import { HttpService } from '@nestjs/axios';
import { HttpServiceMock } from '../../common/services/mocks/http-service.mock';

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
          provide: HttpService,
          useClass: HttpServiceMock,
        },
      ],
    }).compile();

    service = module.get(EspApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
