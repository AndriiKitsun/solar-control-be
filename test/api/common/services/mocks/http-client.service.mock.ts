import { AbstractHttpService } from '@api/services/abstract-http.service';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { ClassMock } from '@common/types/test.types';
import { HttpException } from '@nestjs/common';

export class HttpClientServiceMock implements ClassMock<AbstractHttpService> {
  static readonly responseMock = 'response';

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return HttpClientServiceMock.responseMock as T;
  }

  async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return HttpClientServiceMock.responseMock as T;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return HttpClientServiceMock.responseMock as T;
  }

  didEncounterError(error: AxiosError): HttpException {
    return {} as HttpException;
  }

  async fetch<T>(config: AxiosRequestConfig): Promise<T> {
    return HttpClientServiceMock.responseMock as T;
  }
}
