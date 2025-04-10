import { Test } from '@nestjs/testing';
import { SensorsService } from '@modules/sensors/sensors.service';
import { EspSensorsWsServiceMock } from '@api/modules/esp/ws/sensors/mocks/sensors.service.mock';

describe('SensorsService', () => {
  let service: SensorsService;

  const { sensorMock } = EspSensorsWsServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SensorsService],
    }).compile();

    service = module.get(SensorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onSensorsEvent', () => {
    it('should emit handled sensors data', () => {
      const nextSpy = jest.spyOn(service['sensorsSse$'], 'next');

      service.onSensorsEvent(sensorMock);

      expect(nextSpy).toHaveBeenCalledWith(sensorMock);
    });
  });

  describe('getSensorsData', () => {
    it('should return observable with sensors data', (done: jest.DoneCallback) => {
      service.getSensorsData().subscribe((message) => {
        expect(message.data).toBe(sensorMock);

        done();
      });

      service['sensorsSse$'].next(sensorMock);
    });
  });
});
