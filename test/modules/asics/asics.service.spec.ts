import { Test } from '@nestjs/testing';
import { AsicsRepository } from '@modules/asics/asics.repository';
import { AsicsService } from '@modules/asics/asics.service';
import { UpdateAsicDto, AsicSummaryResponseDto } from '@modules/asics/dto';
import { AsicsRepositoryMock } from './mocks/asics.repository.mock';
import { AsicsServiceMock } from './mocks/asics.service.mock';
import { IdParamMock } from '@common/params/mocks/id.param.mock';
import { LogsService } from '@modules/logs/logs.service';
import { LogsServiceMock } from '../logs/mocks/logs.service.mock';
import { AsicsApiFacade, AsicPerfSummary } from '@api/modules/asics';
import { AsicsApiFacadeMock } from '@api/modules/asics/services/mocks/asics-api.facade.mock';
import { CreateAsicDtoMock } from './dto/mocks/create-asic.dto.mock';
import { Asic } from '@modules/asics/entities';
import { AsicsAuthApiServiceMock } from '@api/modules/asics/collections/auth/mocks/auth.service.mock';
import { LogType } from '@modules/logs/enums';

jest.mock('@common/utils', () => ({
  encrypt: jest.fn(() => 'encrypted'),
  decrypt: jest.fn(() => 'password'),
}));

describe('AsicsService', () => {
  let service: AsicsService;
  let asicsRepository: AsicsRepository;
  let asicsApiFacade: AsicsApiFacade;

  const { createAsicDtoMock } = CreateAsicDtoMock;
  const { asicMock, asicsMock, asic2Mock } = AsicsRepositoryMock;
  const { idMock } = IdParamMock;
  const { asicSummaryResponseDtoMock } = AsicsServiceMock;
  const { tokenMock } = AsicsAuthApiServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsService,
        {
          provide: AsicsRepository,
          useClass: AsicsRepositoryMock,
        },
        {
          provide: AsicsApiFacade,
          useClass: AsicsApiFacadeMock,
        },
        {
          provide: LogsService,
          useClass: LogsServiceMock,
        },
      ],
    }).compile();

    service = module.get(AsicsService);
    asicsRepository = module.get(AsicsRepository);
    asicsApiFacade = module.get(AsicsApiFacade);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return created asic', async () => {
      const expectedPayload: Partial<Asic> = {
        ip: '192.168.1.21',
        address: 'address',
        password: 'encrypted',
        hostname: 'hostname',
      };

      const getInfoSpy = jest.spyOn(asicsApiFacade, 'getInfo');
      const createSpy = jest.spyOn(asicsRepository, 'create');

      const result = await service.create(createAsicDtoMock);

      expect(getInfoSpy).toHaveBeenCalledWith(createAsicDtoMock.ip);
      expect(createSpy).toHaveBeenCalledWith(expectedPayload);

      expect(result).toBe(asicMock);
    });
  });

  describe('findAll', () => {
    it('should return asics', async () => {
      const findAllSpy = jest.spyOn(asicsRepository, 'findAll');

      const result = await service.findAll();

      expect(findAllSpy).toHaveBeenCalled();

      expect(result).toBe(asicsMock);
    });
  });

  describe('update', () => {
    let updateSpy: jest.SpiedFunction<AsicsRepository['update']>;

    beforeEach(() => {
      updateSpy = jest.spyOn(asicsRepository, 'update');
    });

    it('should update asic with passed dto', async () => {
      const dtoMock: UpdateAsicDto = { address: 'home' };

      const result = await service.update(idMock, dtoMock);

      expect(updateSpy).toHaveBeenCalledWith(idMock, dtoMock);

      expect(result).toBe(asicMock);
    });

    it('should encrypt passed password', async () => {
      const dtoMock: UpdateAsicDto = { password: 'pass' };
      const expectedDto: UpdateAsicDto = { password: 'encrypted' };

      await service.update(idMock, dtoMock);

      expect(updateSpy).toHaveBeenCalledWith(idMock, expectedDto);
    });
  });

  describe('delete', () => {
    it('should delete asic', async () => {
      const deleteSoy = jest.spyOn(asicsRepository, 'delete');

      const result = await service.delete(idMock);

      expect(deleteSoy).toHaveBeenCalledWith(idMock);

      expect(result).toBeUndefined();
    });
  });

  describe('getSummary', () => {
    it('should return mapped summary response', async () => {
      const findOneSpy = jest.spyOn(asicsRepository, 'findOne');
      const getSummarySpy = jest.spyOn(asicsApiFacade, 'getSummary');
      const getPerfSummarySpy = jest.spyOn(asicsApiFacade, 'getPerfSummary');

      const result = await service.getSummary(idMock);

      expect(findOneSpy).toHaveBeenCalledWith(idMock);
      expect(getSummarySpy).toHaveBeenCalledWith(asicMock.ip);
      expect(getPerfSummarySpy).toHaveBeenCalledWith(asicMock.ip);

      expect(result).toEqual(asicSummaryResponseDtoMock);
    });

    it('should return partial response', async () => {
      const expectedResult: AsicSummaryResponseDto = {
        hostname: 'hostname',
        ip: '192.168.55.1',
        status: {
          state: undefined,
          stateTimeDays: 0,
          stateTimeHours: 0,
          stateTimeMinutes: 0,
        },
      };

      jest.spyOn(asicsApiFacade, 'getSummary').mockResolvedValueOnce(null);
      jest
        .spyOn(asicsApiFacade, 'getPerfSummary')
        .mockResolvedValueOnce({} as AsicPerfSummary);

      const result = await service.getSummary(idMock);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('start', () => {
    it('should login and start asic', async () => {
      const loginSpy = jest.spyOn(asicsApiFacade, 'login');
      const startSpy = jest.spyOn(asicsApiFacade, 'start');

      const result = await service.start(asicMock);

      expect(loginSpy).toHaveBeenCalledWith(asicMock.ip, 'password');
      expect(startSpy).toHaveBeenCalledWith(asicMock.ip, tokenMock);

      expect(result).toBeUndefined();
    });
  });

  describe('startAsics', () => {
    it('should login and start all asicc in list', async () => {
      const loginSpy = jest.spyOn(asicsApiFacade, 'login');
      const startSpy = jest.spyOn(asicsApiFacade, 'start');

      await Promise.all(service.startAsics(asicsMock, LogType.CONTROL));

      expect(loginSpy).toHaveBeenNthCalledWith(1, asicMock.ip, 'password');
      expect(loginSpy).toHaveBeenNthCalledWith(2, asic2Mock.ip, 'password');

      expect(startSpy).toHaveBeenNthCalledWith(1, asicMock.ip, tokenMock);
      expect(startSpy).toHaveBeenNthCalledWith(2, asic2Mock.ip, tokenMock);
    });
  });

  describe('stop', () => {
    it('should login and stop asic', async () => {
      const loginSpy = jest.spyOn(asicsApiFacade, 'login');
      const stopSpy = jest.spyOn(asicsApiFacade, 'stop');

      const result = await service.stop(asicMock);

      expect(loginSpy).toHaveBeenCalledWith(asicMock.ip, 'password');
      expect(stopSpy).toHaveBeenCalledWith(asicMock.ip, tokenMock);

      expect(result).toBeUndefined();
    });
  });

  describe('stopAsics', () => {
    it('should login and stop all asics in list', async () => {
      const loginSpy = jest.spyOn(asicsApiFacade, 'login');
      const stopSpy = jest.spyOn(asicsApiFacade, 'stop');

      await Promise.all(service.stopAsics(asicsMock, LogType.CONTROL));

      expect(loginSpy).toHaveBeenNthCalledWith(1, asicMock.ip, 'password');
      expect(loginSpy).toHaveBeenNthCalledWith(2, asic2Mock.ip, 'password');

      expect(stopSpy).toHaveBeenNthCalledWith(1, asicMock.ip, tokenMock);
      expect(stopSpy).toHaveBeenNthCalledWith(2, asic2Mock.ip, tokenMock);
    });
  });
});
