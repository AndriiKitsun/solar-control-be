import { Test } from '@nestjs/testing';
import { LogsRepositoryMock } from './mocks/logs.repository.mock';
import { LogsService } from '@modules/logs/logs.service';
import { LogsRepository } from '@modules/logs/logs.repository';
import { LogParamsMock } from './params/log.params.mock';

describe('LogsService', () => {
  let service: LogsService;
  let logsRepository: LogsRepository;

  const { logParamsMock } = LogParamsMock;
  const { logsMock } = LogsRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LogsService,
        {
          provide: LogsRepository,
          useClass: LogsRepositoryMock,
        },
      ],
    }).compile();

    service = module.get(LogsService);
    logsRepository = module.get(LogsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLogs', () => {
    it('should return all logs', async () => {
      const getLogsSpy = jest.spyOn(logsRepository, 'getLogs');

      const result = await service.getLogs(logParamsMock);

      expect(getLogsSpy).toHaveBeenCalledWith(logParamsMock);

      expect(result).toBe(logsMock);
    });
  });
});
