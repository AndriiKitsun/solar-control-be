import { Test, TestingModule } from '@nestjs/testing';
import { EspWsService } from '@api/modules/esp/ws/esp-ws.service';
import { EspConfig } from '@config/esp.config';

jest.mock('ws');

describe('EspWsService', () => {
  let service: EspWsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EspWsService,
        {
          provide: EspConfig.KEY,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get(EspWsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
