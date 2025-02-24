import { EspHttpBaseApiService } from '../../services';
import { Injectable } from '@nestjs/common';
import { EspPzemCounter } from './pzems.types';

@Injectable()
export class EspPzemsApiService extends EspHttpBaseApiService {
  resetCounter(): Promise<EspPzemCounter[]> {
    const url = this.buildUrl('pzems', 'counter');

    return this.delete(url);
  }
}
