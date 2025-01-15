import { Test, TestingModule } from '@nestjs/testing';
import { AsicsService, AsicsController } from '@models/asics';
import { AsicsServiceMock } from './mocks/asics.service.mock';
import { AsicIdParams } from '@models/asics/params';

describe('AsicsController', () => {
  let controller: AsicsController;
  let asicsService: AsicsService;

  const { asicIdMock, asicSummaryResponseDtoMock } = AsicsServiceMock;

  const paramsMock: AsicIdParams = {
    id: asicIdMock,
  };

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

      const result = await controller.getSummary(paramsMock);

      expect(getSummarySpy).toHaveBeenCalledTimes(1);
      expect(getSummarySpy).toHaveBeenCalledWith(asicIdMock);

      expect(result).toBe(asicSummaryResponseDtoMock);
    });
  });
});
