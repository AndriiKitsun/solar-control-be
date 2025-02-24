import { Test } from '@nestjs/testing';
import { EspProtectionRulesApiService } from '@api/modules/esp';
import { HttpService } from '@nestjs/axios';
import { EspConfig } from '@config/esp.config';
import { EspConfigMock } from '@config/mocks/esp.config.mock';
import { HttpServiceMock } from '../../../../services/mocks/http-service.mock';

describe('EspProtectionRulesApiService', () => {
  let service: EspProtectionRulesApiService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EspProtectionRulesApiService,
        {
          provide: EspConfig.KEY,
          useValue: EspConfigMock,
        },
        {
          provide: HttpService,
          useValue: HttpServiceMock,
        },
      ],
    }).compile();

    service = module.get(EspProtectionRulesApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
