import { EspHttpBaseService } from '../../services';
import { Injectable } from '@nestjs/common';
import { EspRelayStatus } from './relays.types';

@Injectable()
export class EspRelaysService extends EspHttpBaseService {
  getRelayStatus(): Promise<EspRelayStatus> {
    const url = this.buildUrl('relays');

    return this.get(url);
  }

  updatePowerRelay(status: boolean): Promise<EspRelayStatus> {
    const endpoint = status ? 'on' : 'off';
    const url = this.buildUrl('relays', endpoint);

    return this.post(url);
  }
}
