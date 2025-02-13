import { Test, TestingModule } from '@nestjs/testing';
import { PzemsWsService } from '../../../../src/modules/pzems/services/pzems-ws.service';
import { PzemsGateway } from '../../../../src/modules/pzems/pzems.gateway';
import { PzemsService } from '../../../../src/modules/pzems/services/pzems.service';
import { ESP_WS_SERVICE } from '@api/modules/esp/esp.constants';
import { PzemsServiceMock } from './mocks/pzems.service.mock';
import { PzemsGatewayMock } from '../mocks/pzems.gateway.mock';
import { EspWsServiceMock } from '@api/modules/esp/ws/mocks/esp-ws.service.mock';

describe('PzemsWsService', () => {
  let service: PzemsWsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PzemsWsService,
        {
          provide: ESP_WS_SERVICE,
          useClass: EspWsServiceMock,
        },
        {
          provide: PzemsGateway,
          useClass: PzemsGatewayMock,
        },
        {
          provide: PzemsService,
          useClass: PzemsServiceMock,
        },
      ],
    }).compile();

    service = module.get(PzemsWsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
