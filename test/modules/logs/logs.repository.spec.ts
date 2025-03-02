import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RepositoryMock } from '@common/mocks/repository.mock';
import { Repository } from 'typeorm';
import { LogsRepository } from '@modules/logs/logs.repository';
import { Log } from '@modules/logs/entities';
import { LogParamsMock } from './params/log.params.mock';
import { LogsRepositoryMock } from './mocks/logs.repository.mock';

describe('LogsRepository', () => {
  let repository: LogsRepository;
  let logRepository: Repository<Log>;

  const { logParamsMock } = LogParamsMock;
  const { logsMock } = LogsRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LogsRepository,
        {
          provide: getRepositoryToken(Log),
          useClass: RepositoryMock<Log>,
        },
      ],
    }).compile();

    repository = module.get(LogsRepository);
    logRepository = module.get(getRepositoryToken(Log));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getLogs', () => {
    it('should return all logs', async () => {
      const findSpy = jest
        .spyOn(logRepository, 'find')
        .mockResolvedValueOnce(logsMock);

      const result = await repository.getLogs(logParamsMock);

      expect(findSpy).toHaveBeenCalled();

      expect(result).toBe(logsMock);
    });
  });
});
