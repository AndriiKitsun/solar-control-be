import { Test } from '@nestjs/testing';
import { EspSensorsWsService } from '@api/modules/esp/ws/sensors/sensors.service';
import { EspConfig } from '@config/esp.config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { EventEmitter2Mock } from '@common/mocks/event-emitter2.mock';
import { EspSensorsWsServiceMock } from './mocks/sensors.service.mock';
import { Cache } from 'cache-manager';
import { ESP_SENSORS_EVENT, ESP_SENSORS_CACHE } from '@api/modules/esp';

jest.mock('ws');

describe('EspSensorsWsService', () => {
  let service: EspSensorsWsService;
  let eventEmitter: EventEmitter2;
  let cache: Cache;

  const { sensorMock } = EspSensorsWsServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EspSensorsWsService,
        {
          provide: EspConfig.KEY,
          useValue: {},
        },
        {
          provide: EventEmitter2,
          useClass: EventEmitter2Mock,
        },
        {
          provide: CACHE_MANAGER,
          useClass: Map,
        },
      ],
    }).compile();

    service = module.get(EspSensorsWsService);
    eventEmitter = module.get(EventEmitter2);
    cache = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleMessage', () => {
    it('should translate esp data', () => {
      const emitSpy = jest.spyOn(eventEmitter, 'emit');
      const setSpy = jest.spyOn(cache, 'set');

      service.handleMessage(sensorMock);

      expect(emitSpy).toHaveBeenCalledWith(ESP_SENSORS_EVENT, sensorMock);
      expect(setSpy).toHaveBeenCalledWith(ESP_SENSORS_CACHE, sensorMock);
    });
  });
});
