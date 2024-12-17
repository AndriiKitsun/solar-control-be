import { Test, TestingModule } from '@nestjs/testing';
import { PzemsWsService } from './pzems-ws.service';
import { PzemsGateway } from '../pzems.gateway';
import { PzemsService } from './pzems.service';
import { ESP_WS_SERVICE } from '@api/modules/esp/esp.constants';
import { EventEmitter } from 'node:events';

describe('PzemsWsService', () => {
  let service: PzemsWsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PzemsWsService,
        {
          provide: ESP_WS_SERVICE,
          useValue: {
            events: new EventEmitter(),
          },
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
