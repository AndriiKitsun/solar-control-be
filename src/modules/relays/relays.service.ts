import { Injectable } from '@nestjs/common';
import { EspRelayStatus, EspRelaysApiService } from '@api/modules/esp';

@Injectable()
export class RelaysService {
  constructor(private readonly espRelaysApiService: EspRelaysApiService) {}

  getRelayStatus(): Promise<EspRelayStatus> {
    return this.espRelaysApiService.getRelayStatus();
  }

  updatePowerRelay(status: boolean): Promise<EspRelayStatus> {
    return this.espRelaysApiService.updatePowerRelay(status);
  }
}
