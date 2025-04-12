import { Test } from '@nestjs/testing';
import { LogsRepositoryMock } from './mocks/logs.repository.mock';
import { LogsService } from '@modules/logs/logs.service';
import { LogsRepository } from '@modules/logs/logs.repository';
import { LogParamsMock } from './params/log.params.mock';
import { LogsServiceMock } from './mocks/logs.service.mock';
import { CreateLogDtoMock } from './dto/mocks/create-log.dto.mock';
import { LogPayload, RunWithLogOptions } from '@modules/logs/logs.types';
import { LogType, LogLevel } from '@modules/logs/enums';
import { CreateLogDto } from '@modules/logs/dto';

describe('LogsService', () => {
  let service: LogsService;
  let logsRepository: LogsRepository;

  const { logParamsMock } = LogParamsMock;
  const { logsMock, logMock } = LogsRepositoryMock;
  const { logMessageMock } = LogsServiceMock;
  const { createLogDtoMock } = CreateLogDtoMock;

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

  describe('getLogStream', () => {
    it('should stream logs', (done) => {
      service.getLogStream().subscribe((message) => {
        expect(message).toEqual(logMessageMock);

        done();
      });

      service['logs$'].next(logMock);
    });
  });

  describe('saveLog', () => {
    it('should save log in db and stream to sse', async () => {
      const saveLogSpy = jest.spyOn(logsRepository, 'saveLog');
      const nextSpy = jest.spyOn(service['logs$'], 'next');

      await service.saveLog(createLogDtoMock);

      expect(saveLogSpy).toHaveBeenCalledWith(createLogDtoMock);
      expect(nextSpy).toHaveBeenCalledWith(createLogDtoMock);
    });
  });

  describe('deleteLogs', () => {
    it('should delete logs', async () => {
      const deleteAllSpy = jest.spyOn(logsRepository, 'deleteAll');

      await service.deleteLogs();

      expect(deleteAllSpy).toHaveBeenCalled();
    });
  });

  describe('debug', () => {
    it('should save log with debug level', () => {
      const saveLogSpy = jest.spyOn(service, 'saveLog').mockImplementation();
      const logPayloadMock: LogPayload = {
        type: LogType.CONTROL,
        message: 'message',
      };
      const expectedLogPayload: CreateLogDto = {
        type: LogType.CONTROL,
        message: 'message',
        level: LogLevel.DEBUG,
      };

      service.debug(logPayloadMock);

      expect(saveLogSpy).toHaveBeenCalledWith(expectedLogPayload);
    });
  });

  describe('info', () => {
    it('should save log with info level', () => {
      const saveLogSpy = jest.spyOn(service, 'saveLog').mockImplementation();
      const logPayloadMock: LogPayload = {
        type: LogType.CONTROL,
        message: 'message',
      };
      const expectedLogPayload: CreateLogDto = {
        type: LogType.CONTROL,
        message: 'message',
        level: LogLevel.INFO,
      };

      service.info(logPayloadMock);

      expect(saveLogSpy).toHaveBeenCalledWith(expectedLogPayload);
    });
  });

  describe('warn', () => {
    it('should save log with warn level', () => {
      const saveLogSpy = jest.spyOn(service, 'saveLog').mockImplementation();
      const logPayloadMock: LogPayload = {
        type: LogType.CONTROL,
        message: 'message',
      };
      const expectedLogPayload: CreateLogDto = {
        type: LogType.CONTROL,
        message: 'message',
        level: LogLevel.WARN,
      };

      service.warn(logPayloadMock);

      expect(saveLogSpy).toHaveBeenCalledWith(expectedLogPayload);
    });
  });

  describe('error', () => {
    it('should save log with error level', () => {
      const saveLogSpy = jest.spyOn(service, 'saveLog').mockImplementation();
      const logPayloadMock: LogPayload = {
        type: LogType.CONTROL,
        message: 'message',
      };
      const expectedLogPayload: CreateLogDto = {
        type: LogType.CONTROL,
        message: 'message',
        level: LogLevel.ERROR,
      };

      service.error(logPayloadMock);

      expect(saveLogSpy).toHaveBeenCalledWith(expectedLogPayload);
    });
  });

  describe('runWith', () => {
    const optionsMock: RunWithLogOptions = {
      before: {
        type: LogType.CONTROL,
        message: 'before log',
      },
      after: {
        type: LogType.PROTECTION,
        message: 'after log',
      },
    };

    let infoSpy: jest.SpiedFunction<LogsService['info']>;
    let warnSpy: jest.SpiedFunction<LogsService['warn']>;

    beforeEach(() => {
      infoSpy = jest.spyOn(service, 'info').mockImplementation();
      warnSpy = jest.spyOn(service, 'warn').mockImplementation();
    });

    it('should execute callback with logs', async () => {
      const result = await service.runWith(
        () => Promise.resolve(123),
        optionsMock,
      );

      expect(infoSpy).toHaveBeenCalledWith(optionsMock.before);
      expect(warnSpy).not.toHaveBeenCalled();

      expect(result).toBe(123);
    });

    it('should save log with warn level when callback throws error', async () => {
      const result = await service.runWith(() => {
        throw new Error('error');
      }, optionsMock);

      expect(infoSpy).toHaveBeenCalledWith(optionsMock.before);
      expect(warnSpy).toHaveBeenCalledWith(optionsMock.after);

      expect(result).toBeUndefined();
    });
  });
});
