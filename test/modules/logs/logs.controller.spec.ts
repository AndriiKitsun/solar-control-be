import { Test } from '@nestjs/testing';
import { LogsServiceMock } from './mocks/logs.service.mock';
import { LogsController } from '@modules/logs/logs.controller';
import { LogsService } from '@modules/logs/logs.service';
import { LogParamsMock } from './params/log.params.mock';
import { LogsRepositoryMock } from './mocks/logs.repository.mock';
import { CreateLogDtoMock } from './dto/mocks/create-log.dto.mock';

describe('LogsController', () => {
  let controller: LogsController;
  let logsService: LogsService;

  const { logParamsMock } = LogParamsMock;
  const { logsMock } = LogsRepositoryMock;
  const { logMessageMock } = LogsServiceMock;
  const { createLogDtoMock } = CreateLogDtoMock;

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

      expect(getLogsSpy).toHaveBeenCalledWith(logParamsMock);

      expect(result).toBe(logsMock);
    });
  });

  describe('getLogStream', () => {
    it('should stream logs', (done) => {
      const getLogStreamSpy = jest.spyOn(logsService, 'getLogStream');

      controller.getLogStream().subscribe((message) => {
        expect(getLogStreamSpy).toHaveBeenCalled();

        expect(message).toBe(logMessageMock);

        done();
      });
    });
  });

  describe('saveLog', () => {
    it('should save log', async () => {
      const saveLogSpy = jest.spyOn(logsService, 'saveLog');

      const result = await controller.saveLog(createLogDtoMock);

      expect(saveLogSpy).toHaveBeenCalledWith(createLogDtoMock);

      expect(result).toBeUndefined();
    });
  });

  describe('deleteLogs', () => {
    it('should delete all logs', async () => {
      const deleteLogsSpy = jest.spyOn(logsService, 'deleteLogs');

      const result = await controller.deleteLogs();

      expect(deleteLogsSpy).toHaveBeenCalled();

      expect(result).toBeUndefined();
    });
  });
});
