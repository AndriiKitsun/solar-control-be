import { HttpClientService } from '@api/common/services/http-client.service';
import { AxiosRequestConfig } from 'axios';
import { ClassMock } from '@common/types/test.types';

export class HttpApiServiceMock implements ClassMock<HttpClientService> {
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
