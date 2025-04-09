import { Test } from '@nestjs/testing';
import { SensorsRepositoryMock } from './mocks/sensors.repository.mock';
import { AppConfig } from '@config/app.config';
import { AppConfigMock } from '@config/mocks/app.config.mock';
import { SensorsService } from '@modules/sensors/sensors.service';
import { SensorsRepository } from '@modules/sensors/sensors.repository';
import {
  SENSORS_DATA_EVENT,
  SENSORS_DATA_CACHE,
} from '@modules/sensors/sensors.constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EspSensorsWsServiceMock } from '@api/modules/esp/ws/sensors/mocks/sensors.service.mock';
import { EventEmitter2Mock } from '@common/mocks/event-emitter2.mock';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

describe('SensorsService', () => {
  let service: SensorsService;
  let sensorsRepository: SensorsRepository;
  let eventEmitter2: EventEmitter2;
  let cache: Cache;

  const { sensorMock } = SensorsRepositoryMock;
  const { espSensorsDataMock } = EspSensorsWsServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SensorsService,
        {
          provide: SensorsRepository,
          useClass: SensorsRepositoryMock,
        },
        {
          provide: AppConfig.KEY,
          useValue: AppConfigMock,
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

    service = module.get(SensorsService);
    sensorsRepository = module.get(SensorsRepository);
    eventEmitter2 = module.get(EventEmitter2);
    cache = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onSensorsEvent', () => {
    it('should emit handled sensors data', async () => {
      const saveSensorsSpy = jest
        .spyOn(service, 'saveSensors')
        .mockResolvedValueOnce(sensorMock);
      const emitSpy = jest.spyOn(eventEmitter2, 'emit');
      const setSpy = jest.spyOn(cache, 'set');

      await service.onSensorsEvent(espSensorsDataMock);

      expect(saveSensorsSpy).toHaveBeenCalledWith(espSensorsDataMock);
      expect(emitSpy).toHaveBeenCalledWith(SENSORS_DATA_EVENT, sensorMock);
      expect(setSpy).toHaveBeenCalledWith(SENSORS_DATA_CACHE, sensorMock);
    });
  });

  describe('onModuleInit', () => {
    let deleteAllSpy: jest.SpiedFunction<SensorsRepository['deleteAll']>;

    beforeEach(() => {
      deleteAllSpy = jest.spyOn(sensorsRepository, 'deleteAll');
    });

    it('should clear sensors table when this feature is enabled', () => {
      AppConfigMock.feature.clearSensors = true;

      service.onModuleInit();

      expect(deleteAllSpy).toHaveBeenCalled();
    });

    it('should not clear sensors table when this feature is disabled', () => {
      AppConfigMock.feature.clearSensors = false;

      service.onModuleInit();

      expect(deleteAllSpy).not.toHaveBeenCalled();
    });
  });

  describe('getSensorsData', () => {
    it('should return observable with sensors data', (done: jest.DoneCallback) => {
      service.getSensorsData().subscribe((data) => {
        expect(data.data).toEqual(sensorMock);

        done();
      });

      service['sensors$'].next(sensorMock);
    });
  });
});
