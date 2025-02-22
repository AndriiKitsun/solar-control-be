import { Test, TestingModule } from '@nestjs/testing';
import { EspSensorsWsService } from '@api/modules/esp/ws/sensors/sensors.service';
import { EspConfig } from '@config/esp.config';
import { EventEmitter2 } from '@nestjs/event-emitter';

jest.mock('ws');

describe('EspWsService', () => {
  let service: EspSensorsWsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EspSensorsWsService,
        {
          provide: EspConfig.KEY,
          useValue: {},
        },
        {
          provide: EventEmitter2,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get(EspSensorsWsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
