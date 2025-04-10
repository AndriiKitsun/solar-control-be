import { Test } from '@nestjs/testing';
import { SensorsController } from '@modules/sensors/sensors.controller';
import { SensorsService } from '@modules/sensors/sensors.service';
import { SensorsServiceMock } from './mocks/sensors.service.mock';
import { EspSensorsWsServiceMock } from '@api/modules/esp/ws/sensors/mocks/sensors.service.mock';

describe('SensorsController', () => {
  let controller: SensorsController;
  let sensorsService: SensorsService;

  const { sensorMock } = EspSensorsWsServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SensorsController,
        {
          provide: SensorsService,
          useClass: SensorsServiceMock,
        },
      ],
    }).compile();

    controller = module.get(SensorsController);
    sensorsService = module.get(SensorsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSensorsData', () => {
    it('should return sensors data stream', (done: jest.DoneCallback) => {
      const getSensorsDataSpy = jest.spyOn(sensorsService, 'getSensorsData');

      controller.getSensorsData().subscribe((message) => {
        expect(getSensorsDataSpy).toHaveBeenCalled();

        expect(message.data).toBe(sensorMock);

        done();
      });
    });
  });
});
