import { Test } from '@nestjs/testing';
import { LogsServiceMock } from './mocks/logs.service.mock';
import { LogsController } from '@modules/logs/logs.controller';
import { LogsService } from '@modules/logs/logs.service';
import { LogParamsMock } from './params/log.params.mock';
import { LogsRepositoryMock } from './mocks/logs.repository.mock';

describe('LogsController', () => {
  let controller: LogsController;
  let logsService: LogsService;

  const { logParamsMock } = LogParamsMock;
  const { logsMock } = LogsRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [LogsController],
      providers: [
        {
          provide: LogsService,
          useClass: LogsServiceMock,
        },
      ],
    }).compile();

    controller = module.get(LogsController);
    logsService = module.get(LogsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLogs', () => {
    it('should return all logs', async () => {
      const getLogsSpy = jest.spyOn(logsService, 'getLogs');

      const result = await controller.getLogs(logParamsMock);

      expect(getLogsSpy).toHaveBeenCalled();

      expect(result).toBe(logsMock);
    });
  });
});
