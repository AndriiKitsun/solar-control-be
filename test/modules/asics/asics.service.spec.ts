import { Test } from '@nestjs/testing';
import { AsicsRepository } from '@modules/asics/asics.repository';
import { AsicsService } from '@modules/asics/asics.service';
import { UpdateAsicDto, AsicSummaryResponseDto } from '@modules/asics/dto';
import { AsicsApiService } from '@api/modules';
import { AsicsRepositoryMock } from './mocks/asics.repository.mock';
import { AsicsApiServiceMock } from '@api/modules/asics/mocks/asics.service.mock';
import { AsicsServiceMock } from './mocks/asics.service.mock';
import { IdParamMock } from '@common/params/mocks/id.param.mock';

jest.mock('@common/utils', () => ({
  encrypt: jest.fn(() => 'encrypted'),
}));

describe('AsicsService', () => {
  let service: AsicsService;
  let asicsRepository: AsicsRepository;
  let asicsApiService: AsicsApiService;

  const { asicSummaryResponseDtoMock } = AsicsServiceMock;
  const { asicMock } = AsicsRepositoryMock;
  const { idMock } = IdParamMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsService,
        {
          provide: AsicsRepository,
          useClass: AsicsRepositoryMock,
        },
        {
          provide: AsicsApiService,
          useClass: AsicsApiServiceMock,
        },
      ],
    }).compile();

    service = module.get(AsicsService);
    asicsRepository = module.get(AsicsRepository);
    asicsApiService = module.get(AsicsApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update', () => {
    let updateSpy: jest.SpiedFunction<AsicsRepository['update']>;

    beforeEach(() => {
      updateSpy = jest.spyOn(asicsRepository, 'update');
    });

    it('should update asic with passed dto', async () => {
      const dtoMock: UpdateAsicDto = {
        address: 'home',
      };

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

  describe('getSummary', () => {
    it('should return mapped summary response', async () => {
      const findOneSpy = jest.spyOn(asicsRepository, 'findOne');
      const getSummarySpy = jest.spyOn(asicsApiService, 'getSummary');
      const getPerfSummarySpy = jest.spyOn(asicsApiService, 'getPerfSummary');

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

      jest.spyOn(asicsApiService, 'getSummary').mockResolvedValueOnce(null);
      jest.spyOn(asicsApiService, 'getPerfSummary').mockResolvedValueOnce(null);

      const result = await service.getSummary(idMock);

      expect(result).toEqual(expectedResult);
    });
  });
});
