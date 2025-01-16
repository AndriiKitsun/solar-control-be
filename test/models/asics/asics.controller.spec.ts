import { Test, TestingModule } from '@nestjs/testing';
import { AsicsService, AsicsController } from '@models/asics';
import { AsicsServiceMock } from './mocks/asics.service.mock';
import { IdParamMock } from '@common/params/mocks/id.param.mock';

describe('AsicsController', () => {
  let controller: AsicsController;
  let asicsService: AsicsService;

  const { asicSummaryResponseDtoMock } = AsicsServiceMock;
  const { idParamsMock, idMock } = IdParamMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AsicsController,
        {
          provide: AsicsService,
          useClass: AsicsServiceMock,
        },
      ],
    }).compile();

    controller = module.get(AsicsController);
    asicsService = module.get(AsicsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSummary', () => {
    it('should return summary response', async () => {
      const getSummarySpy = jest.spyOn(asicsService, 'getSummary');

      const result = await controller.getSummary(idParamsMock);

      expect(getSummarySpy).toHaveBeenCalledTimes(1);
      expect(getSummarySpy).toHaveBeenCalledWith(idMock);

      expect(result).toBe(asicSummaryResponseDtoMock);
    });
  });
});
