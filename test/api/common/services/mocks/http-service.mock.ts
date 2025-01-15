import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import { Observable, of } from 'rxjs';
import { ClassMock } from '@common/types/test.types';

export class HttpServiceMock implements ClassMock<HttpService> {
  static readonly urlMock = 'url';
  static readonly responseDataMock = 'data';
  static readonly axiosResponseMock: AxiosResponse = {
    data: this.responseDataMock,
  } as AxiosResponse;

  request<T>(config: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    return of(HttpServiceMock.axiosResponseMock);
  }

  get<T, D>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Observable<AxiosResponse<T, D>> {
    return of(HttpServiceMock.axiosResponseMock);
  }

  delete<T, D>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Observable<AxiosResponse<T, D>> {
    return of(HttpServiceMock.axiosResponseMock);
  }

  head<T, D>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Observable<AxiosResponse<T, D>> {
    return of(HttpServiceMock.axiosResponseMock);
  }

  post<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<AxiosResponse<T, D>> {
    return of(HttpServiceMock.axiosResponseMock);
  }

  put<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<AxiosResponse<T, D>> {
    return of(HttpServiceMock.axiosResponseMock);
  }

  patch<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<AxiosResponse<T, D>> {
    return of(HttpServiceMock.axiosResponseMock);
  }

  postForm<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<AxiosResponse<T, D>> {
    return of(HttpServiceMock.axiosResponseMock);
  }

  putForm<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<AxiosResponse<T, D>> {
    return of(HttpServiceMock.axiosResponseMock);
  }

  patchForm<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Observable<AxiosResponse<T, D>> {
    return of(HttpServiceMock.axiosResponseMock);
  }

  get axiosRef(): AxiosInstance {
    return {} as AxiosInstance;
  }
}
