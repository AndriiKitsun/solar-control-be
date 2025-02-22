import { HttpException, Inject, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosError } from 'axios';

export abstract class AbstractHttpService {
  @Inject(HttpService)
  private readonly httpService!: HttpService;

  protected get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.fetch({
      url,
      method: 'get',
      ...config,
    });
  }

  protected post<T = any, D = any>(
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

  protected put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> {
    return this.fetch({
      url,
      method: 'put',
      data,
      ...config,
    });
  }

  protected delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.fetch({
      url,
      method: 'delete',
      ...config,
    });
  }

  protected mapStatusCode(statusCode: number | undefined): HttpStatus {
    if (!statusCode) {
      return HttpStatus.GATEWAY_TIMEOUT;
    }

    if (statusCode >= 500) {
      return HttpStatus.BAD_GATEWAY;
    }

    return statusCode;
  }

  private async fetch<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.httpService.axiosRef.request<T>(config);

      return response.data;
    } catch (err) {
      throw this.didEncounterError(err as AxiosError);
    }
  }

  protected abstract didEncounterError(error: AxiosError): HttpException;
}
