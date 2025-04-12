import { Test } from '@nestjs/testing';
import { AsicsRepository } from '@modules/asics/asics.repository';
import { Asic } from '@modules/asics/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RepositoryMock } from '@common/mocks/repository.mock';
import { Repository, EntityNotFoundError } from 'typeorm';
import { AsicsRepositoryMock } from './mocks/asics.repository.mock';
import { IdParamMock } from '@common/params/mocks/id.param.mock';
import { UpdateAsicDtoMock } from './dto/mocks/update-asic.dto.mock';

describe('AsicsRepository', () => {
  let repository: AsicsRepository;
  let asicRepository: Repository<Asic>;

  const { asicsMock, asicMock } = AsicsRepositoryMock;
  const { idMock } = IdParamMock;
  const { updateAsicDtoMock } = UpdateAsicDtoMock;
  const { affectedUpdateResultMock, affectedDeleteResultMock } = RepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsRepository,
        {
          provide: getRepositoryToken(Asic),
          useClass: RepositoryMock<Asic>,
        },
      ],
    }).compile();

    repository = module.get(AsicsRepository);
    asicRepository = module.get(getRepositoryToken(Asic));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should return created asic', async () => {
      const asicDtoMock: Partial<Asic> = {
        ip: '127.0.0.1',
      };
      const insertSpy = jest.spyOn(asicRepository, 'insert');

      const result = await repository.create(asicDtoMock);

      expect(insertSpy).toHaveBeenCalledWith(asicDtoMock);

      expect(result).toEqual(asicDtoMock);
    });
  });

  describe('findAll', () => {
    it('should return all asics', async () => {
      const findSpy = jest
        .spyOn(asicRepository, 'find')
        .mockResolvedValueOnce(asicsMock);

      const result = await repository.findAll();

      expect(findSpy).toHaveBeenCalled();

      expect(result).toBe(asicsMock);
    });
  });

  describe('findWhere', () => {
    it('should return asics by where condition', async () => {
      const findSpy = jest
        .spyOn(asicRepository, 'find')
        .mockResolvedValueOnce(asicsMock);

      const result = await repository.findWhere({ automated: true });

      expect(findSpy).toHaveBeenCalledWith({
        where: { automated: true },
      });

      expect(result).toBe(asicsMock);
    });
  });

  describe('findOne', () => {
    it('should return asic', async () => {
      const findOneOrFailSpy = jest
        .spyOn(asicRepository, 'findOneOrFail')
        .mockResolvedValueOnce(asicMock);

      const result = await repository.findOne(idMock);

      expect(findOneOrFailSpy).toHaveBeenCalledWith({
        where: { id: idMock },
        cache: expect.any(Object),
      });

      expect(result).toBe(asicMock);
    });
  });

  describe('update', () => {
    it('should throw error when asic not found', async () => {
      const updateSpy = jest.spyOn(asicRepository, 'update');

      const cb = () => repository.update(idMock, updateAsicDtoMock);

      await expect(cb).rejects.toThrow(EntityNotFoundError);

      expect(updateSpy).toHaveBeenCalledWith(idMock, updateAsicDtoMock);
    });

    it('should return updated asic', async () => {
      jest
        .spyOn(asicRepository, 'update')
        .mockResolvedValueOnce(affectedUpdateResultMock);
      const findOneSpy = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(asicMock);

      const result = await repository.update(idMock, updateAsicDtoMock);

      expect(findOneSpy).toHaveBeenCalledWith(idMock);

      expect(result).toBe(asicMock);
    });
  });

  describe('delete', () => {
    it('should throw error when asic not found', async () => {
      const deleteSpy = jest.spyOn(asicRepository, 'delete');

      const cb = () => repository.delete(idMock);

      await expect(cb).rejects.toThrow(EntityNotFoundError);

      expect(deleteSpy).toHaveBeenCalledWith(idMock);
    });

    it('should return undefined without error', async () => {
      jest
        .spyOn(asicRepository, 'delete')
        .mockResolvedValueOnce(affectedDeleteResultMock);

      const result = await repository.delete(idMock);

      expect(result).toBeUndefined();
    });
  });
});
