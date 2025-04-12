import { Test } from '@nestjs/testing';
import { AsicsService } from '@modules/asics/asics.service';
import { AsicsController } from '@modules/asics/asics.controller';
import { AsicsServiceMock } from './mocks/asics.service.mock';
import { IdParamMock } from '@common/params/mocks/id.param.mock';
import { CreateAsicDtoMock } from './dto/mocks/create-asic.dto.mock';
import { AsicsRepositoryMock } from './mocks/asics.repository.mock';
import { UpdateAsicDtoMock } from './dto/mocks/update-asic.dto.mock';

describe('AsicsController', () => {
  let controller: AsicsController;
  let asicsService: AsicsService;

  const { createAsicDtoMock } = CreateAsicDtoMock;
  const { asicMock, asicsMock } = AsicsRepositoryMock;
  const { idParamsMock, idMock } = IdParamMock;
  const { updateAsicDtoMock } = UpdateAsicDtoMock;
  const { asicSummaryResponseDtoMock } = AsicsServiceMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
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

  describe('create', () => {
    it('should return created asic', async () => {
      const createSpy = jest.spyOn(asicsService, 'create');

      const result = await controller.create(createAsicDtoMock);

      expect(createSpy).toHaveBeenCalledWith(createAsicDtoMock);

      expect(result).toBe(asicMock);
    });
  });

  describe('findAll', () => {
    it('should return all asics', async () => {
      const findAllSpy = jest.spyOn(asicsService, 'findAll');

      const result = await controller.findAll();

      expect(findAllSpy).toHaveBeenCalled();

      expect(result).toBe(asicsMock);
    });
  });

  describe('update', () => {
    it('should return updated asic', async () => {
      const updateSpy = jest.spyOn(asicsService, 'update');

      const result = await controller.update(idParamsMock, updateAsicDtoMock);

      expect(updateSpy).toHaveBeenCalledWith(idMock, updateAsicDtoMock);

      expect(result).toBe(asicMock);
    });
  });

  describe('delete', () => {
    it('should delete asic', async () => {
      const deleteSpy = jest.spyOn(asicsService, 'delete');

      const result = await controller.delete(idParamsMock);

      expect(deleteSpy).toHaveBeenCalledWith(idMock);

      expect(result).toBeUndefined();
    });
  });

  describe('getSummary', () => {
    it('should return summary response', async () => {
      const getSummarySpy = jest.spyOn(asicsService, 'getSummary');

      const result = await controller.getSummary(idParamsMock);

      expect(getSummarySpy).toHaveBeenCalledWith(idMock);

      expect(result).toBe(asicSummaryResponseDtoMock);
    });
  });
});
