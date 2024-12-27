import { Injectable, Inject } from '@nestjs/common';
import { EspConfig, EspConfigType } from '@config/esp';
import { EspResetPzemCounterResponse } from './esp.types';
import { HttpClientService } from '../../common/modules';

@Injectable()
export class EspApiService {
  constructor(
    @Inject(EspConfig.KEY) private readonly espConfig: EspConfigType,
    private readonly httpClientService: HttpClientService,
  ) {}

  checkHealth(): Promise<string> {
    const url = this.buildUrl(['health']);

    return this.httpClientService.get<string>(url);
  }

  resetCounter(): Promise<EspResetPzemCounterResponse> {
    const url = this.buildUrl(['pzems', 'counter']);

    return this.httpClientService.delete(url);
  }

  private buildUrl(path: string[]): string {
    return new URL(path.join('/'), this.espConfig.endpoint).toString();
  }
}
