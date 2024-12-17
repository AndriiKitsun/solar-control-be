import { ClassMock } from '@common/types/test.types';
import { HttpApiService } from '../http-api.service';
import { AxiosRequestConfig } from 'axios';

export class HttpApiServiceMock implements ClassMock<HttpApiService> {
  static responseMock = 'response';

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return HttpApiServiceMock.responseMock as T;
  }

  async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return HttpApiServiceMock.responseMock as T;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return HttpApiServiceMock.responseMock as T;
  }
}
