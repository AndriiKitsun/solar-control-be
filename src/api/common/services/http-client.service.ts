import { HttpException, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosError } from 'axios';

export abstract class HttpClientService {
  @Inject(HttpService)
  private readonly httpService!: HttpService;

  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.fetch({
      url,
      method: 'get',
      ...config,
    });
  }

  post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> {
    return this.fetch({
      url,
      method: 'post',
      data,
      ...config,
    });
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.fetch({
      url,
      method: 'delete',
      ...config,
    });
  }

  async fetch<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.httpService.axiosRef.request<T>(config);

      return response.data;
    } catch (err) {
      throw this.didEncounterError(err as AxiosError);
    }
  }

  abstract didEncounterError(error: AxiosError): HttpException;
}
