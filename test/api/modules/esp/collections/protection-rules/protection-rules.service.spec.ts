import { Test } from '@nestjs/testing';
import { EspProtectionRulesService } from '@api/modules/esp';
import { HttpService } from '@nestjs/axios';
import { EspConfig } from '@config/esp.config';
import { EspConfigMock } from '@config/mocks/esp.config.mock';
import { HttpServiceMock } from '../../../../services/mocks/http-service.mock';

describe('EspProtectionRulesService', () => {
  let service: EspProtectionRulesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EspProtectionRulesService,
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

    service = module.get(EspProtectionRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
