import { Injectable, Inject } from '@nestjs/common';
import { EspConfig, EspConfigType } from '@config/api';
import { EspResetPzemCounterResponse } from './esp.types';
import { HttpApiService } from '../../common';

@Injectable()
export class EspApiService {
  constructor(
    @Inject(EspConfig.KEY) private readonly espConfig: EspConfigType,
    private readonly httpApiService: HttpApiService,
  ) {}

  checkHealth(): Promise<string> {
    const url = this.buildUrl(['health']);

    return this.httpApiService.get<string>(url);
  }

  resetCounter(): Promise<EspResetPzemCounterResponse> {
    const url = this.buildUrl(['pzems', 'counter']);

    return this.httpApiService.delete(url);
  }

  private buildUrl(path: string[]): string {
    return `${this.espConfig.endpoint}${path.join('/')}`;
  }
}
