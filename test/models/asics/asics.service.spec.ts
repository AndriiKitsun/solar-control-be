import { Test, TestingModule } from '@nestjs/testing';
import {
  AsicsService,
  AsicsRepository,
  AsicSummaryResponseDto,
} from '@models/asics';
import { AsicsApiService } from '@api/modules';
import { AsicsRepositoryMock } from './mocks/asics.repository.mock';
import { AsicsApiServiceMock } from '@api/modules/asics/mocks/asics.service.mock';
import { AsicsServiceMock } from './mocks/asics.service.mock';
import { IdParamMock } from '@common/params/mocks/id.param.mock';

describe('AsicsService', () => {
  let service: AsicsService;
  let asicsRepository: AsicsRepository;
  let asicsApiService: AsicsApiService;

  const { asicSummaryResponseDtoMock } = AsicsServiceMock;
  const { asicMock } = AsicsRepositoryMock;
  const { idMock } = IdParamMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

  describe('getSummary', () => {
    it('should return mapped summary response', async () => {
      const findOneSpy = jest.spyOn(asicsRepository, 'findOne');
      const getSummarySpy = jest.spyOn(asicsApiService, 'getSummary');

      const result = await service.getSummary(idMock);

      expect(findOneSpy).toHaveBeenCalledTimes(1);
      expect(findOneSpy).toHaveBeenCalledWith(idMock);

      expect(getSummarySpy).toHaveBeenCalledTimes(1);
      expect(getSummarySpy).toHaveBeenCalledWith(asicMock.ip);

      expect(result).toEqual(asicSummaryResponseDtoMock);
    });

    it('should return partial response', async () => {
      const expectedResul: AsicSummaryResponseDto = {
        hostname: 'hostname',
        ip: '192.168.55.1',
      };

      jest.spyOn(asicsApiService, 'getSummary').mockResolvedValueOnce(null);

      const result = await service.getSummary(idMock);

      expect(result).toEqual(expectedResul);
    });
  });
});
