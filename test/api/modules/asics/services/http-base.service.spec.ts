import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { AsicsHttpBaseApiService } from '@api/modules/asics/services/http-base.service';
import { HttpServiceMock } from '../../../services/mocks/http-service.mock';
import { AsicsHttpBaseApiServiceMock } from './mocks/http-base.service.mock';
import { AxiosError, AxiosHeaders } from 'axios';
import { SystemName, ErrorCode } from '@common/enums';
import { ServerError, HttpSubError } from '@common/interfaces';

jest.mock('node:crypto', () => ({
  randomUUID: jest.fn(() => 'randomId'),
}));

class AsicsHttpApiServiceMock extends AsicsHttpBaseApiService {}

describe('AsicsHttpBaseApiService', () => {
  let service: AsicsHttpApiServiceMock;

  const { ipMock } = AsicsHttpBaseApiServiceMock;

  jest.useFakeTimers({
    now: 1744194584518,
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AsicsHttpApiServiceMock,
        {
          provide: HttpService,
          useClass: HttpServiceMock,
        },
      ],
    }).compile();

    service = module.get(AsicsHttpApiServiceMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buildUrl', () => {
    it('should return url with ip address and endpoint', () => {
      const expectedResult = `http://192.168.0.1/api/v1/some/endpoint`;

      const result = service['buildUrl'](ipMock, 'some/endpoint');

      expect(result).toBe(expectedResult);
    });
  });

  describe('didEncounterError', () => {
    it('should handle axios error using response data', () => {
      const errorMock = new AxiosError(
        'errorMessage',
        'errorCode',
        undefined,
        null,
        {
          config: {
            headers: new AxiosHeaders(),
          },
          headers: {},
          statusText: '',
          status: 400,
          data: 'some error response',
        },
      );
      const expectedResult: ServerError<HttpSubError> = {
        id: 'randomId',
        errors: [
          {
            code: 'errorCode',
            message: 'some error response',
            type: 'AxiosError',
          },
        ],
        status: 400,
        system: SystemName.ASIC,
        timestamp: '2025-04-09T10:29:44.518Z',
      };

      const result = service['didEncounterError'](errorMock);

      expect(result.getStatus()).toBe(400);
      expect(result.getResponse()).toEqual(expectedResult);
    });

    it('should return error with stringified error response', () => {
      const errorMock = new AxiosError(
        'errorMessage',
        'errorCode',
        undefined,
        null,
        {
          config: {
            headers: new AxiosHeaders(),
          },
          headers: {},
          statusText: '',
          status: 400,
          data: {
            error: 'some error response',
          },
        },
      );
      const expectedResult: ServerError<HttpSubError> = {
        id: 'randomId',
        errors: [
          {
            code: 'errorCode',
            message: '{"error":"some error response"}',
            type: 'AxiosError',
          },
        ],
        status: 400,
        system: SystemName.ASIC,
        timestamp: '2025-04-09T10:29:44.518Z',
      };

      const result = service['didEncounterError'](errorMock);

      expect(result.getStatus()).toBe(400);
      expect(result.getResponse()).toEqual(expectedResult);
    });

    it('should return error with fallback values when no response in error', () => {
      const errorMock = new AxiosError('errorMessage');
      const expectedResult: ServerError<HttpSubError> = {
        id: 'randomId',
        errors: [
          {
            code: ErrorCode.HTTP_UNKNOWN,
            message: 'errorMessage',
            type: 'AxiosError',
          },
        ],
        status: 500,
        system: SystemName.ASIC,
        timestamp: '2025-04-09T10:29:44.518Z',
      };

      const result = service['didEncounterError'](errorMock);

      expect(result.getStatus()).toBe(500);
      expect(result.getResponse()).toEqual(expectedResult);
    });
  });
});
