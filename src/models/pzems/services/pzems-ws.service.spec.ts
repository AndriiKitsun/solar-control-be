import { Test, TestingModule } from '@nestjs/testing';
import { PzemsWsService } from './pzems-ws.service';
import { EspConfig } from '@config/api';
import { PzemsGateway } from '../pzems.gateway';
import { PzemsService } from './pzems.service';

jest.mock('ws');

describe('PzemsWsService', () => {
  let service: PzemsWsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PzemsWsService,
        {
          provide: EspConfig.KEY,
          useValue: {},
        },
        {
          provide: PzemsGateway,
          useValue: {},
        },
        {
          provide: PzemsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get(PzemsWsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
