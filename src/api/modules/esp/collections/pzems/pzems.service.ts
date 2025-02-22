import { EspHttpBaseService } from '../../services';
import { Injectable } from '@nestjs/common';
import { EspPzemCounter } from './pzems.types';

@Injectable()
export class EspPzemsService extends EspHttpBaseService {
  resetCounter(): Promise<EspPzemCounter[]> {
    const url = this.buildUrl('pzems', 'counter');

    return this.delete(url);
  }
}
