import { HttpApiService } from '@api/common/modules/http-api/http-api.service';
import { AxiosRequestConfig } from 'axios';
import { ClassMock } from '@common/types/test.types';

export class HttpApiServiceMock implements ClassMock<HttpApiService> {
  static readonly responseMock = 'response';

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
