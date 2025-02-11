import { Test, TestingModule } from '@nestjs/testing';
import { EspApiService } from '@api/modules';
import {
  PzemsService,
  PzemsRepository,
  SENSORS_AVG_VOLTAGE_CONFIG,
} from '@models/pzems';
import { PzemsRepositoryMock } from '../mocks/pzems.repository.mock';
import { EspApiServiceMock } from '@api/modules/esp/mocks/esp-service.mock';
import { AppConfig } from '@config/app.config';
import { AppConfigMock } from '@config/mocks/app.config.mock';
import { EspWsServiceMock } from '@api/modules/esp/ws/mocks/esp-ws.service.mock';

describe('PzemsService', () => {
  let service: PzemsService;
  let pzemsRepository: PzemsRepository;
  let espApiService: EspApiService;

  const { espPzemDataMock } = EspWsServiceMock;
  const { pzemMock } = PzemsRepositoryMock;
  const { counterResetResponseMock } = EspApiServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PzemsService,
        {
          provide: PzemsRepository,
          useClass: PzemsRepositoryMock,
        },
        {
          provide: EspApiService,
          useClass: EspApiServiceMock,
        },
        {
          provide: AppConfig.KEY,
          useValue: AppConfigMock,
        },
      ],
    }).compile();

    service = module.get(PzemsService);
    pzemsRepository = module.get(PzemsRepository);
    espApiService = module.get(EspApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    let clearPzemTableSpy: jest.SpiedFunction<
      PzemsRepository['clearPzemTable']
    >;

    beforeEach(() => {
      clearPzemTableSpy = jest.spyOn(pzemsRepository, 'clearPzemTable');
    });

    it('should clear pzems table when this feature is enabled', () => {
      AppConfigMock.feature.clearPzems = true;

      service.onModuleInit();

      expect(clearPzemTableSpy).toHaveBeenCalled();
    });

    it('should not clear pzems table when this feature is disabled', () => {
      AppConfigMock.feature.clearPzems = false;

      service.onModuleInit();

      expect(clearPzemTableSpy).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    let createSpy: jest.SpiedFunction<PzemsRepository['create']>;
    let calcAvgVoltageSpy: jest.SpyInstance;

    beforeEach(() => {
      createSpy = jest.spyOn(pzemsRepository, 'create');
      calcAvgVoltageSpy = jest.spyOn(service as any, 'calcAvgVoltage');
    });

    it('should return created pzem entity', async () => {
      const result = await service.create(espPzemDataMock);

      expect(calcAvgVoltageSpy).toHaveBeenCalledWith(
        espPzemDataMock,
        SENSORS_AVG_VOLTAGE_CONFIG,
      );
      expect(createSpy).toHaveBeenCalledWith(espPzemDataMock);

      expect(result).toBe(pzemMock);
    });
  });

  describe('resetEnergyCounter', () => {
    it('should return reset response', async () => {
      const resetCounterSpy = jest.spyOn(espApiService, 'resetCounter');

      const result = await service.resetEnergyCounter();

      expect(resetCounterSpy).toHaveBeenCalled();

      expect(result).toBe(counterResetResponseMock);
    });
  });
});
